"use client";

import { AuthProvider } from "@/features/auth/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }) {
    return (
        <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
        </AuthProvider>
    );
}
