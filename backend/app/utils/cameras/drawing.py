import cv2

from app.utils.geometry import face_inside_person


def draw_faces(frame, face_locations, face_names):

    for (top, right, bottom, left), name in zip(face_locations, face_names):

        color = (0,255,0) if name != "Unknown" else (0,0,255)

        cv2.rectangle(frame, (left,top), (right,bottom), color, 2)

        cv2.putText(
            frame,
            name,
            (left, top - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            color,
            2
        )


def draw_hidden_people(frame, people, faces):

    for person in people:

        if face_inside_person(person, faces):
            continue

        top, right, bottom, left = person

        cv2.rectangle(frame, (left, top), (right, bottom), (0,165,255), 2)

        cv2.putText(
            frame,
            "Person (Face Hidden)",
            (left, top-10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0,165,255),
            2
        )