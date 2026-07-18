def create_mjpeg_frame(frame_bytes):

    return (
        b"--frame\r\n"
        b"Content-Type: image/jpeg\r\n\r\n"
        + frame_bytes +
        b"\r\n"
    )