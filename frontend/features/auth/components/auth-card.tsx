import { ReactNode } from "react";

type AuthCardProps = {
    title?: string;
    subtitle?: string;
    children: ReactNode;
};

export function AuthCard({
    title,
    subtitle,
    children,
}: AuthCardProps): JSX.Element {
    return (
        <div className="flex flex-col gap-y-8 rounded-lg border border-border p-8">
            {(title || subtitle) && (
                <div className="flex min-w-80 flex-col">
                    {title && (
                        <span className="text-lg font-semibold text-foreground">
                            {title}
                        </span>
                    )}

                    {subtitle && (
                        <span className="text-sm text-muted-foreground">
                            {subtitle}
                        </span>
                    )}
                </div>
            )}

            {children}
        </div>
    );
}
