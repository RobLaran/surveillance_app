"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signInAction } from "@/features/auth/actions/sign-in";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { AuthCard } from "@/features/auth/components/auth-card";
import { Logo } from "@/features/dashboard/components/logo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

type SignInFormValues = {
    email: string;
    password: string;
};

export function SignInForm() {
    const router = useRouter();
    const form = useForm<SignInFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    async function onSubmit(values: SignInFormValues) {
        const result = await signInAction(values);

        if (!result.success) {
            toast.error(result.message || "Something went wrong");
            return;
        }
        toast.success(result.message || "Sign in successful 🎉");

        router.replace("/");
        router.refresh();
    }

    return (
        <AuthLayout>
            <Logo subtext="Smart Home Surveillance" isColumn isGreen />

            <AuthCard
                title="Welcome back"
                subtitle="Sign in to access your dashboard"
            >
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-y-4"
                        noValidate
                    >
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
                                    <Label>Email</Label>

                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            variant="auth"
                                            placeholder="admin@aisentinel.com"
                                        />
                                    </FormControl>

                                    <div className="min-h-4">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

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
                                    <Label>Password</Label>

                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            variant="auth"
                                            placeholder="••••••••"
                                        />
                                    </FormControl>

                                    <div className="min-h-4">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            variant="outline_green"
                            size="full"
                            disabled={isSubmitting}
                            className="cursor-pointer"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </Form>
            </AuthCard>

            <div className="flex items-center">
                <span className="text-sm text-muted-foreground">
                    Don't have an account?
                </span>

                <Link href="/sign-up" className="pl-2 text-sm text-primary">
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    );
}
