from typing import TypedDict

class CreateUserData(TypedDict):
    first_name: str
    last_name: str
    email: str
    password_hash: str

class LoginUserData(TypedDict):
    email: str
    password: str