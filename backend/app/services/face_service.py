import cv2
import numpy as np
from pathlib import Path
from insightface.app import FaceAnalysis

# =========================
# CONFIG
# =========================
FACE_THRESHOLD = 0.5
FACES_DIR = Path("data/faces")
ENCODINGS_DIR = Path("data/encodings")
CUDA_PROVIDERS = ['CUDAExecutionProvider', 'CPUExecutionProvider']

KNOWN_PEOPLE = [
    ("Rob",     ["rob.jpg", "rob_masked.jpg"]),
    ("Blanche", ["blanche2.jpg", "blanche2_masked.jpg"]),
]

# =========================
# MODELS
# =========================
face_app = FaceAnalysis(
    allowed_modules=["detection", "recognition"],
    providers=CUDA_PROVIDERS
)
face_app.prepare(ctx_id=0, det_size=(640, 640))

# =========================
# LOAD / CACHE ENCODINGS
# =========================
def _load_encodings():
    ENCODINGS_DIR.mkdir(parents=True, exist_ok=True)
    cache_file = ENCODINGS_DIR / "encodings.npz"

    if cache_file.exists():
        print("[INFO] Loading encodings from cache")
        data = np.load(cache_file, allow_pickle=True)
        return list(data["encodings"]), list(data["names"])

    print("[INFO] No cache found, encoding from images")
    return _encode_from_images(cache_file)

def _encode_from_images(cache_file):
    enroll_app = FaceAnalysis(
        allowed_modules=["detection", "recognition"],
        providers=CUDA_PROVIDERS
    )

    encodings = []
    names = []

    for name, filenames in KNOWN_PEOPLE:
        for filename in filenames:
            path = FACES_DIR / filename
            if not path.exists():
                print(f"[WARN] Skipping missing file: {path}")
                continue
            img = cv2.imread(str(path))
            if img is None:
                print(f"[WARN] Could not read image: {path}")
                continue

            faces = None
            for det_size in [(320, 320), (224, 224), (160, 160)]:
                enroll_app.prepare(ctx_id=0, det_size=det_size)
                faces = enroll_app.get(img)
                if faces:
                    break

            if not faces:
                print(f"[WARN] No face found in: {path}, skipping")
                continue

            face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
            encodings.append(face.normed_embedding)
            names.append(name)

    if not encodings:
        raise ValueError("No valid face encodings loaded — check your image files")

    np.savez(cache_file, encodings=encodings, names=names)
    print(f"[INFO] Encodings saved to cache: {cache_file}")
    return encodings, names

# =========================
# RECOGNITION
# =========================
_known_encodings_list, _known_names = _load_encodings()
known_face_encodings = np.array(_known_encodings_list)
known_face_names = _known_names

def recognize_face(embedding):
    """Returns (name, similarity) for the closest known face."""
    sims = np.dot(known_face_encodings, embedding)
    best_idx = np.argmax(sims)
    best_sim = sims[best_idx]
    if best_sim >= FACE_THRESHOLD:
        return known_face_names[best_idx], float(best_sim)
    return "Unknown", float(best_sim)

def get_face_app():
    return face_app