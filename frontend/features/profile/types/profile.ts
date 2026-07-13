export type Profile = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    location: string | null;
    joinDate: string;
    lastLogin: string | null;
    avatar: string | null;
    ipAddress: string;
    userAgent: string;
};

export type EditedProfile = Profile;

export type LoginLog = {
    login_log_id: string;
    created_at: string;
    ip_address: string;
    user_agent: string;
    status: string;
};

export interface UpdateCurrentUserValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    location: string | null;
}
