import threading

from app.core.frame_cache import clear_frame, set_frame
from app.services.camera_service import get_camera_details, update_camera_status
from app.utils.cameras.camera import open_camera, read_frame, reconnect_camera, refresh_camera
from app.utils.cameras.encoding import encode_frame
from app.services.detection_service import detect_faces, detect_people
from app.utils.cameras.drawing import draw_faces, draw_hidden_people

class CameraWorker:

    def __init__(self, user_id, camera_id):
        self.user_id = user_id
        self.camera_id = camera_id
        self.viewers = 0
        self.thread = None
        self.running = False
        self.DETECT_EVERY = 5 
        self.DB_REFRESH_EVERY = 150

    def start(self):

        if self.running:
            return

        self.running = True

        self.thread = threading.Thread(
            target=self.run,
            daemon=True
        )

        self.thread.start()

    def stop(self):
        self.running = False

    def run(self):

        camera = get_camera_details(self.camera_id)

        if camera is None:
            return

        source = camera["camera_stream_url"]

        if isinstance(source, str) and source.isdigit():
            source = int(source)

        print(f"Opening camera {self.camera_id}")
        cap = open_camera(source)

        if cap is None:
            print(f"Failed to open camera {self.camera_id}")
            while self.running and cap is None:
                cap = reconnect_camera(
                    worker=self,
                    user_id=self.user_id,
                    camera_id=self.camera_id,
                    source=source,
                )

        update_camera_status(self.camera_id, "online")

        frame_count = 0

        people = []
        face_locations = []
        face_names = []

        try:
            while self.running:

                cap, frame = read_frame(
                    worker=self,
                    cap=cap,
                    source=source,
                    user_id=self.user_id,
                    camera_id=self.camera_id,
                )

                if frame is None:
                    cap = reconnect_camera(
                        worker=self,
                        user_id=self.user_id,
                        camera_id=self.camera_id,
                        source=source
                    )

                    if cap is None:
                        continue
                        
                    continue

                frame_count += 1

                # Refresh DB configuration 
                camera = refresh_camera(self.camera_id, frame_count, camera)
                
                # AI Detection 
                if frame_count % self.DETECT_EVERY == 0: 
                    if camera.get("ai_enabled"): 
                        people = detect_people(frame) 
                        face_locations, face_names = detect_faces(frame) 
                    else: 
                        people = [] 
                        face_locations = [] 
                        face_names = [] 
                        
                # Draw detections 
                if camera.get("ai_enabled"): 
                    draw_faces( 
                        frame, 
                        face_locations, 
                        face_names, 
                    ) 

                    draw_hidden_people( 
                        frame, people, 
                        face_locations, 
                    )

                frame_bytes = encode_frame(frame)

                set_frame(
                    self.camera_id,
                    frame_bytes,
                )

        finally:
            if cap:
                cap.release()

            clear_frame(self.camera_id)

            update_camera_status(
                self.camera_id,
                "offline",
            )