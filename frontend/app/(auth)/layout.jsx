import { AuthLayout } from "@/features/auth/components/auth-layout";

export default function AuthRootLayout({ children }) {
  return (
      <AuthLayout>
        {children}
      </AuthLayout>
  );
}