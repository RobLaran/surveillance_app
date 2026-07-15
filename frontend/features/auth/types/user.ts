export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    location: string | null;
    joinDate: string;
    lastLogin: string | null;
    avatarUrl: string | null;
    ipAddress: string;
    userAgent: string;
}
export interface UserResponse {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    location: string | null;
    avatar_path: string | null;
    avatar_url: string | null;
    created_at: string;
    ip_address: string;
    user_agent: string;
    last_login: string | null;
}
