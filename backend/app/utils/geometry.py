IOU_THRESHOLD = 0.1

def get_iou(boxA, boxB):
    """Returns overlap ratio between two (top, right, bottom, left) boxes."""
    xA = max(boxA[3], boxB[3])
    yA = max(boxA[0], boxB[0])
    xB = min(boxA[1], boxB[1])
    yB = min(boxA[2], boxB[2])

    inter = max(0, xB - xA) * max(0, yB - yA)
    if inter == 0:
        return 0.0

    areaA = (boxA[1] - boxA[3]) * (boxA[2] - boxA[0])
    areaB = (boxB[1] - boxB[3]) * (boxB[2] - boxB[0])
    return inter / float(areaA + areaB - inter)

def face_inside_person(person_box, face_boxes):
    """Returns True if any face box overlaps with this person box."""
    return any(get_iou(person_box, fb) > IOU_THRESHOLD for fb in face_boxes)