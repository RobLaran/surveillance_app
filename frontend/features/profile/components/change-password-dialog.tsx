"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check, X, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type ChangePasswordDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ChangePasswordDialog({
    open,
    onOpenChange,
}: ChangePasswordDialogProps) {
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    const passwordStrength = {
        weak: newPassword.length < 8,
        medium:
            newPassword.length >= 8 &&
            /[A-Z]/.test(newPassword) &&
            /\d/.test(newPassword),
        strong:
            newPassword.length >= 12 &&
            /[A-Z]/.test(newPassword) &&
            /\d/.test(newPassword) &&
            /[!@#$%^&*]/.test(newPassword),
    };

    const getStrengthColor = (): string => {
        if (passwordStrength.strong) return "text-green-500";
        if (passwordStrength.medium) return "text-yellow-500";
        if (newPassword.length > 0) return "text-red-500";
        return "text-muted-foreground";
    };

    const getStrengthText = (): string => {
        if (passwordStrength.strong) return "Strong";
        if (passwordStrength.medium) return "Medium";
        if (newPassword.length > 0) return "Weak";
        return "No password";
    };

    const isPasswordValid =
        currentPassword &&
        newPassword &&
        confirmPassword &&
        newPassword === confirmPassword &&
        newPassword !== currentPassword;

    const resetForm = (): void => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess(false);
    };

    const handleClose = (): void => {
        if (isLoading || success) return;

        resetForm();
        onOpenChange(false);
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();

        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword === currentPassword) {
            setError(
                "New password cannot be the same as your current password.",
            );
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);

        try {
            // TODO:
            // Replace this with your changePasswordAction()

            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSuccess(true);

            setTimeout(() => {
                resetForm();
                onOpenChange(false);
            }, 2000);
        } catch (err: unknown) {
            setError("Failed to change password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="border-border bg-card">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Change Password
                    </DialogTitle>

                    <DialogDescription>
                        {success
                            ? "Password changed successfully!"
                            : "Enter your current password and your new password."}
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                            <Check className="h-6 w-6 text-green-500" />
                        </div>

                        <p className="font-medium">
                            Your password has been updated.
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Please sign in using your new password next time.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Current Password */}

                        <div className="space-y-2">
                            <Label>Current Password</Label>

                            <div className="relative">
                                <Input
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    placeholder="Enter current password"
                                    disabled={isLoading}
                                    className="pr-10"
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() =>
                                        setShowCurrentPassword(
                                            !showCurrentPassword,
                                        )
                                    }
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}

                        <div className="space-y-2">
                            <Label>New Password</Label>

                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    placeholder="Enter new password"
                                    disabled={isLoading}
                                    className="pr-10"
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            {newPassword && (
                                <>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                                            <div
                                                className={cn(
                                                    "h-full transition-all",
                                                    passwordStrength.strong
                                                        ? "w-full bg-green-500"
                                                        : passwordStrength.medium
                                                          ? "w-2/3 bg-yellow-500"
                                                          : "w-1/3 bg-red-500",
                                                )}
                                            />
                                        </div>

                                        <span
                                            className={cn(
                                                "text-xs font-medium",
                                                getStrengthColor(),
                                            )}
                                        >
                                            {getStrengthText()}
                                        </span>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Password must contain at least 8
                                        characters, an uppercase letter, a
                                        number, and a special character.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Confirm Password */}

                        <div className="space-y-2">
                            <Label>Confirm Password</Label>

                            <div className="relative">
                                <Input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Confirm password"
                                    disabled={isLoading}
                                    className="pr-10"
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            {confirmPassword && (
                                <div className="flex items-center gap-2">
                                    {newPassword === confirmPassword ? (
                                        <>
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-xs text-green-500">
                                                Passwords match
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <X className="h-4 w-4 text-red-500" />
                                            <span className="text-xs text-red-500">
                                                Passwords do not match
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                                <p className="text-xs text-red-500">{error}</p>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={!isPasswordValid || isLoading}
                            >
                                {isLoading ? "Changing..." : "Change Password"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
