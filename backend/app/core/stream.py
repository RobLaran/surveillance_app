import time

from app.core.frame_cache import get_frame
from app.utils.cameras.streaming import create_mjpeg_frame
from app.core.camera_worker import CameraWorker

def generate_frames(worker: CameraWorker, camera_id: int):
    try:
        while True:

            frame = get_frame(camera_id)

            if frame is None:
                time.sleep(0.03)
                continue

            yield create_mjpeg_frame(frame)
    except GeneratorExit:
        print("Client disconnected")
    finally:
        print(f'Viwers: {worker.viewers}')
        worker.viewers -= 1
        if worker.viewers <= 0:
            worker.stop()