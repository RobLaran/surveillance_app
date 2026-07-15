"use client";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
    const sizeClasses: Record<
        NonNullable<LoadingSpinnerProps["size"]>,
        string
    > = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizeClasses[size]} relative`}>
                {/* Outer rotating ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin" />

                {/* Inner counter-rotating ring */}
                <div
                    className="absolute inset-1 rounded-full border-2 border-transparent border-b-primary/50 animate-spin"
                    style={{
                        animationDirection: "reverse",
                        animationDuration: "0.8s",
                    }}
                />

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                </div>
            </div>
        </div>
    );
}
