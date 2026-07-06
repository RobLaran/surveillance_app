"use client";

export function AuthLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-background gap-y-14 py-12">
            {children}
        </div>
    );
}
