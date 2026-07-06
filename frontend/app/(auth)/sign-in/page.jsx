import { SignInForm } from "@/features/auth/components/sign-in-form";

export default async function SignInPage({ searchParams }) {
    const { status } = await searchParams;

    return <SignInForm status={status} />;
}
