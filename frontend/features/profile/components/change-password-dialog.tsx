"use client";

import { useState } from "react";
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
import { Eye, EyeOff, Check, X, Lock } from "lucide-react";

type ChangePasswordDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type ChangePasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export function ChangePasswordDialog({
    open,
    onOpenChange,
}: ChangePasswordDialogProps) {
    const form = useForm<ChangePasswordForm>({
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
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
        name: "newPassword",
    });

    const {
        formState: { isSubmitting },
    } = form;

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
        toast.success("Password changed");
        handleClose(false);
        console.log(values);
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
                            name="currentPassword"
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
                            name="newPassword"
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
                                                className="pr-10"
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
                            name="confirmPassword"
                            rules={{
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === form.getValues("newPassword") ||
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
                                                className="pr-10"
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
