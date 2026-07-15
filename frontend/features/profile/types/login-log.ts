export interface LoginLogResponse {
    login_log_id: string;
    user_id: string;
    email: string;
    device: string;
    browser: string;
    os: string;
    ip_address: string;
    action: string;
    status: string;
    created_at: string;
}

export interface LoginLog {
    id: string;
    userId: string;
    email: string;
    device: string;
    browser: string;
    os: string;
    ipAddress: string;
    action: string;
    status: string;
    createdAt: string;
}
