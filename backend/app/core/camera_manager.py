from app.core.camera_worker import CameraWorker

workers:dict[int, CameraWorker] = {}

def start_camera(user_id, camera_id):

    worker = workers.get(camera_id)

    if worker is None:

        worker = CameraWorker(user_id, camera_id)

        workers[camera_id] = worker

    worker.start()

    return worker


def stop_camera(camera_id):

    worker = workers.get(camera_id)

    if worker:

        worker.stop()

        del workers[camera_id]