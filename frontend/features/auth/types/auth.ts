export interface User {
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

export type CurrentUser = {
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
};

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
