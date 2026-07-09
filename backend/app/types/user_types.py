from typing import TypedDict

class User(TypedDict):
    user_id: str
    first_name: str
    last_name: str
    email: str
    password_hash: str
    phone_number: str | None
    location: str | None
    avatar_path: str | None
    created_at: str
    updated_at: str

class CurrentUser(TypedDict):
    user_id: str
    first_name: str
    last_name: str
    email: str
    phone_number: str | None
    location: str | None
    avatar_path: str | None
    avatar_url: str | None
    last_login: str | None 
    ip_address: str | None
    user_agent: str | None
    exp: int
    created_at: str

class PublicUser(TypedDict):  
    user_id: str
    first_name: str
    last_name: str
    email: str