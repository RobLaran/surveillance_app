"use client";

import { useWatch, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { signUpAction } from "@/features/auth/actions/sign-up";
import { PasswordStrengthBar } from "@/features/auth/components/password-strength-bar";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { AuthCard } from "@/features/auth/components/auth-card";
import { Logo } from "@/features/dashboard/components/logo";

import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
    const router = useRouter();

    const form = useForm({
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = useWatch({
        control: form.control,
        name: "password",
    });

    const {
        formState: { isSubmitting },
    } = form;

    async function onSubmit(values) {
        const result = await signUpAction(values);

        if (!result.success) {
            if (result.data.errors) {
                Object.values(result.data.errors)
                    .reverse()
                    .forEach((err) => toast.error(err));
                return;
            }

            toast.error(result.data.message);
            return;
        }

        toast.success(result.data.message || "Account created successfully 🎉");

        form.reset();
        router.push("/sign-in");
    }

    return (
        <AuthLayout>
            <Logo subtext="Create your account" isColumn />

            <AuthCard>
                <Form {...form}>
                    <form
                        className="flex flex-col gap-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                        noValidate
                    >
                        {/* First name and Last name field group */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* First Name */}
                            <FormField
                                control={form.control}
                                name="firstName"
                                rules={{
                                    required: "First name is required",
                                    minLength: {
                                        value: 2,
                                        message:
                                            "First name must be at least 2 characters",
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-auth-text-light">
                                            First Name
                                        </Label>

                                        <FormControl>
                                            <Input
                                                variant={"auth_blue"}
                                                placeholder="John"
                                                {...field}
                                            />
                                        </FormControl>

                                        <div className="min-h-4">
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Last Name */}
                            <FormField
                                control={form.control}
                                name="lastName"
                                rules={{
                                    required: "Last name is required",
                                    minLength: {
                                        value: 2,
                                        message:
                                            "Last name must be at least 2 characters",
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <Label className="text-auth-text-light">
                                            Last Name
                                        </Label>

                                        <FormControl>
                                            <Input
                                                variant={"auth_blue"}
                                                placeholder="Doe"
                                                {...field}
                                            />
                                        </FormControl>

                                        <div className="min-h-4">
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-auth-text-light">
                                        Email
                                    </Label>

                                    <FormControl>
                                        <Input
                                            type="email"
                                            variant={"auth_blue"}
                                            placeholder="admin@aisentinel.com"
                                            {...field}
                                        />
                                    </FormControl>

                                    <div className="min-h-4">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            rules={{
                                required: "Password is required",
                                minLength: {
                                    value: 4,
                                    message:
                                        "Password must be at least 4 characters",
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-auth-text-light">
                                        Password
                                    </Label>

                                    <FormControl>
                                        <Input
                                            type="password"
                                            variant={"auth_blue"}
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                    </FormControl>
                                    <PasswordStrengthBar password={password} />

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
                                    value === form.watch("password") ||
                                    "Password does not match",
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-auth-text-light">
                                        Confirm Password
                                    </Label>

                                    <FormControl>
                                        <Input
                                            type="password"
                                            variant={"auth_blue"}
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                    </FormControl>

                                    <div className="min-h-4">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div>
                            <Button
                                type="submit"
                                variant={"outline"}
                                disabled={isSubmitting}
                                size="full"
                                className="cursor-pointer"
                            >
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create account"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </AuthCard>

            <div className="flex items-center">
                <span className="text-sm text-muted-foreground">
                    Already have an account?
                </span>
                <Link href={"/sign-in"} className="text-sm pl-2 text-accent">
                    Sign in
                </Link>
            </div>
        </AuthLayout>
    );
}
