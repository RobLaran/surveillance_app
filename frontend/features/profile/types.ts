type Profile = {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    joinDate: string;
    lastLogin: string | null;
    avatar: string | null;
    ipAddress: string;
};

type EditedProfile = Profile;

type LoginLog = {
    login_log_id: string;
    created_at: string;
    ip_address: string;
    user_agent: string;
    status: string;
};


