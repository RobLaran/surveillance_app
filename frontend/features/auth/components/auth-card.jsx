export function AuthCard({ title, subtitle, children }) {
    return (
        <div className="flex flex-col gap-y-8 rounded-lg border border-border p-8">
            <div className="flex min-w-80 flex-col">
                <span className="text-lg font-semibold text-foreground">
                    {title}
                </span>

                <span className="text-sm text-muted-foreground">
                    {subtitle}
                </span>
            </div>

            {children}
        </div>
    );
}