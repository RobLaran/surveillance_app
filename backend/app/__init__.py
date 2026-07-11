import os 
import logging

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from datetime import timedelta

from app.core.camera_monitor import start_monitor
from app.core.error_handlers import register_error_handlers
from app.core.logging import configure_logging
from app.api.cameras import cameras
from app.api.auth import auth
from app.api.users import users
from app.api.storage import storage
from app.api.login_logs import login_logs
from app.utils.auth.jwt_handlers import register_jwt_callbacks

IS_PROD = os.getenv("FLASK_ENV") == "production"

def create_app():
    app = Flask(__name__)

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(hours=8)
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_ACCESS_COOKIE_NAME"] = "access_token_cookie"
    app.config["JWT_REFRESH_COOKIE_NAME"] = "refresh_token_cookie"
    app.config["JWT_COOKIE_SECURE"] = IS_PROD
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"
    app.config["JWT_COOKIE_HTTPONLY"] = True
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False

    jwt = JWTManager(app)

    register_jwt_callbacks(jwt)
    register_error_handlers(app)
    configure_logging()

    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    app.register_blueprint(cameras)
    app.register_blueprint(auth)
    app.register_blueprint(users)
    app.register_blueprint(storage)
    app.register_blueprint(login_logs)

    # start_monitor()


    return app