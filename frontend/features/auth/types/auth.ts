export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    joinDate: string;
    lastLogin: string | null;
    avatarUrl: string | null;
    ipAddress: string;
    userAgent: string;
};

export interface CurrentUser {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    location: string;
    avatar: string | null;
    avatar_url?: string | null;
    created_at: string;
    login_log: {
        ip_address: string;
        user_agent: string;
        created_at: string;
    } | null;
}

export type SignUpForm = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export interface SignUpValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignInValues {
    email: string;
    password: string;
}

export type AuthResult =
    | {
          success: true;
          message: string;
          data?: unknown;
      }
    | {
          success: false;
          message: string;
          errors?: Record<string, string> | string[];
          status?: number;
      };
