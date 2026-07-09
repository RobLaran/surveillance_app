from flask import jsonify

def success_response(message: str, data=None, status: int = 200):
    response = jsonify({
        "success": True,
        "message": message,
        "data": data,
    })
    response.status_code = status
    return response