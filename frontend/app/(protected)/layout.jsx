import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function ProtectedLayout({ children }) {
    return <AuthGuard>{children}</AuthGuard>;
}
