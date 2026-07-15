"use client";

import { useEffect, useState } from "react";
import { useWatch, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { PasswordStrengthBar } from "@/features/auth/components/password-strength-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";
import { changePasswordRequest } from "@/features/profile/services/profile-service";

type ChangePasswordDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type ChangePasswordForm = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};

export function ChangePasswordDialog({
    open,
    onOpenChange,
}: ChangePasswordDialogProps) {
    const form = useForm<ChangePasswordForm>({
        mode: "onChange",
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePassword = (key: "current" | "new" | "confirm") => {
        setShowPassword((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const newPassword = useWatch({
        control: form.control,
        name: "new_password",
    });

    const confirmPassword = useWatch({
        control: form.control,
        name: "confirm_password",
    });

    const newPasswordError = form.formState.errors.new_password;

    const passwordsMatch =
        !!newPassword &&
        !!confirmPassword &&
        newPassword === confirmPassword &&
        !newPasswordError;

    const {
        formState: { isSubmitting },
    } = form;

    // Keep confirm_password's RHF validation state in sync whenever
    // new_password changes. Without this, RHF only re-validates
    // confirm_password when confirm_password itself changes — so typing
    // confirm_password first, then editing new_password to match, leaves
    // a stale "Passwords do not match" error sitting in form state even
    // though passwordsMatch (computed live above) has already flipped to true.
    useEffect(() => {
        if (form.getFieldState("confirm_password").isTouched) {
            form.trigger("confirm_password");
        }
    }, [newPassword]);

    const resetDialog = () => {
        form.reset();

        setShowPassword({
            current: false,
            new: false,
            confirm: false,
        });
    };

    const handleClose = (isOpen: boolean): void => {
        if (!isOpen) {
            if (isSubmitting) return;

            resetDialog();
        }

        onOpenChange(isOpen);
    };

    const onSubmit = async (values: ChangePasswordForm): Promise<void> => {
        try {
            const message = await changePasswordRequest(values);
            toast.success(message);
            handleClose(false);
        } catch (err) {
            const error = err as ApiError;

            if (error.errors) {
                Object.entries(error.errors).forEach(([field, message]) => {
                    form.setError(field as keyof ChangePasswordForm, {
                        type: "server",
                        message: String(message),
                    });
                });
                return;
            }

            toast.error(error.message);
            return;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-border bg-card">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Change Password
                    </DialogTitle>

                    <DialogDescription>
                        Enter your current password and your new password.
                    </DialogDescription>
                </DialogHeader>

                {/* Change password form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                    >
                        {/* Current Password */}
                        <FormField
                            control={form.control}
                            name="current_password"
                            rules={{
                                required: "Current password is required",
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Current Password</Label>

                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type={
                                                    showPassword.current
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="••••••••"
                                                className="pr-10"
                                            />
                                        </FormControl>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePassword("current")
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword.current ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* New Password */}
                        <FormField
                            control={form.control}
                            name="new_password"
                            rules={{
                                required: "New password is required",
                                minLength: {
                                    value: 4,
                                    message:
                                        "Password must be at least 4 characters",
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>New Password</Label>

                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type={
                                                    showPassword.new
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="••••••••"
                                                className={cn(
                                                    "pr-10",
                                                    confirmPassword.length >=
                                                        4 &&
                                                        (passwordsMatch
                                                            ? "border-green-500 focus-visible:ring-green-500"
                                                            : "border-red-500 focus-visible:ring-red-500"),
                                                )}
                                            />
                                        </FormControl>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePassword("new")
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword.new ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>

                                    <PasswordStrengthBar
                                        password={newPassword}
                                    />

                                    <div className="min-h-4">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password */}
                        <FormField
                            control={form.control}
                            name="confirm_password"
                            rules={{
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === form.getValues("new_password") ||
                                    "Passwords do not match",
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Confirm Password</Label>

                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type={
                                                    showPassword.confirm
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="••••••••"
                                                className={cn(
                                                    "pr-10",
                                                    confirmPassword.length >=
                                                        4 &&
                                                        (passwordsMatch
                                                            ? "border-green-500 focus-visible:ring-green-500"
                                                            : "border-red-500 focus-visible:ring-red-500"),
                                                )}
                                            />
                                        </FormControl>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePassword("confirm")
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword.confirm ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>

                                    {confirmPassword && passwordsMatch && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="font-medium text-green-500">
                                                Passwords match
                                            </span>
                                        </div>
                                    )}

                                    <div className="min-h-4">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleClose(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting
                                    ? "Changing..."
                                    : "Change Password"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
