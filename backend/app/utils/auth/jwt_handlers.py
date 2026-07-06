import logging
from flask import jsonify
from flask_jwt_extended import unset_jwt_cookies

logger = logging.getLogger(__name__)


def register_jwt_callbacks(jwt):

    # Standard error response that preserves cookies (For access token refresh)
    def _jwt_error_response(message, status_code):
        return jsonify({"success": False, "message": message}), status_code

    # Destructive error response that clears cookies (For invalid states & expired sessions)
    def _jwt_destructive_error_response(message, status_code):
        response = jsonify({"success": False, "message": message})
        unset_jwt_cookies(response)
        return response, status_code

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        token_type = jwt_payload.get("type") # Will be either 'access' or 'refresh'

        if token_type == "refresh":
            # 🔴 The overall user session is entirely dead. Wipe the browser cookies cleanly.
            logger.info("Refresh token expired. Evicting user credentials.")
            return _jwt_destructive_error_response("Session has expired. Please sign in again.", 401)
        
        # 🟢 Only the short access token expired. Leave cookies alone so frontend can run the refresh!
        return _jwt_error_response("Token has expired", 401)

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return _jwt_destructive_error_response("Invalid token", 401)

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return _jwt_destructive_error_response("Authentication required", 401)

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return _jwt_destructive_error_response("Token has been revoked", 401)