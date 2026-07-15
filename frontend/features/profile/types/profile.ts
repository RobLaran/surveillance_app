export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    location: string | null;
    joinDate: string;
    lastLogin: string | null;
    avatar: string | null;
    ipAddress: string;
    userAgent: string;
}
export interface UpdateCurrentUserValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    location: string | null;
}
