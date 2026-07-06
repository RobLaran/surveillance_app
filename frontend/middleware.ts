import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
    "/",
    "/management",
    "/cameras",
    "/enrollment",
    "/events",
    "/notifications",
    "/recordings",
    "/settings",
];

const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
    const hasAccessToken = request.cookies.has("access_token_cookie");
    const hasRefreshToken = request.cookies.has("refresh_token_cookie");
    const { pathname } = request.nextUrl;

    const isLoggedIn = hasAccessToken || hasRefreshToken;

    const isProtectedPage = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    const isAuthOnlyPage = AUTH_ROUTES.includes(pathname);

    if (isProtectedPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (isAuthOnlyPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/management/:path*",
        "/cameras/:path*",
        "/enrollment/:path*",
        "/events/:path*",
        "/notifications/:path*",
        "/recordings/:path*",
        "/settings/:path*",
        "/sign-in",
        "/sign-up",
    ],
};
