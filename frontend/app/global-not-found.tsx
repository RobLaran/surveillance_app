import { AlertTriangle } from "lucide-react";
import "./globals.css";

export default function GlobalNotFound() {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full" />
                                <AlertTriangle className="h-20 w-20 text-destructive relative" />
                            </div>
                        </div>

                        <h1 className="text-6xl font-bold text-foreground mb-2">
                            404
                        </h1>

                        <p className="text-2xl font-semibold text-primary mb-2">
                            Page Not Found
                        </p>

                        <p className="text-muted-foreground mb-8">
                            The page you are looking for does not exist.
                        </p>

                        <div className="bg-card border border-border rounded-lg p-4 mb-8 text-left">
                            <p className="text-sm text-muted-foreground font-mono">
                                Error: Page not found
                                <br />
                                Status: 404
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
