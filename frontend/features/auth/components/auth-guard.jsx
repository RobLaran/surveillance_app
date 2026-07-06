import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

export function proxy(request) {
    const { pathname } = request.nextUrl;

    // ❌ CRITICAL: ignore Next.js internals
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith("/api/public")
    ) {
        return NextResponse.next();
    }

    // allow public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    const refreshToken = request.cookies.get("refresh_token_cookie");

    // protect everything else
    if (!refreshToken) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}