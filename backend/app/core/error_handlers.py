import logging

from flask import jsonify
from app.core.exceptions import AppError

logger = logging.getLogger(__name__)

def register_error_handlers(app):

    @app.errorhandler(AppError)
    def handle_app_error(error):
        response = {
            "success": False,
            "message": error.message,
        }

        if error.errors:
            response["errors"] = error.errors

        return jsonify(response), error.status_code

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        logger.exception("Unexpected server error")

        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500