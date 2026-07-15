import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <LoadingSpinner size="lg" />
                    <div className="absolute -inset-4 animate-pulse rounded-full border border-primary/10" />
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-semibold">AI Sentinel</h2>

                    <p className="mt-2 text-muted-foreground">
                        Initializing surveillance system...
                    </p>
                </div>

                <div className="h-1 w-48 overflow-hidden rounded-full bg-card">
                    <div className="h-full animate-pulse rounded-full bg-gradient-to-r from-primary to-primary/50" />
                </div>
            </div>
        </div>
    );
}
