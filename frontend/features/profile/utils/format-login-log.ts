import { LoginLog, LoginLogResponse } from "@/features/profile/types/login-log";

export function formatLoginLog(log: LoginLogResponse): LoginLog {
    return {
        id: log.login_log_id,
        userId: log.user_id,
        email: log.email,
        device: log.device,
        browser: log.browser,
        os: log.os,
        ipAddress: log.ip_address,
        action: log.action,
        status: log.status,
        createdAt: log.created_at,
    };
}
