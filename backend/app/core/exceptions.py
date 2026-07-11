class AppError(Exception):
    def __init__(self, message, status_code=400, errors=None):
        self.message = message
        self.status_code = status_code
        self.errors = errors
        super().__init__(message)

class ValidationError(AppError):
    def __init__(self, errors):
        super().__init__(message="Validation failed", status_code=422, errors=errors)

class ConflictError(AppError):
    def __init__(self, message):
        super().__init__(message, status_code=409)

class UnauthorizedError(AppError):
    def __init__(self, message="Invalid email or password"):
        super().__init__(message, status_code=401)

class NotFoundError(AppError):
    def __init__(self, message):
        super().__init__(message, status_code=404)

class StorageError(AppError):
    def __init__(self, message="Storage operation failed"):
        super().__init__(message, status_code=500)