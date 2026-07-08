"use client";

import { ReactNode } from "react";

type AuthLayoutProps = {
    children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-background gap-y-14 py-12">
            {children}
        </div>
    );
}
