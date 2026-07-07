"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { usePathname } from "next/navigation";
import {
    fetchCurrentUser,
    logoutRequest,
} from "@/features/auth/services/auth-service";
import { AUTH_STATUS } from "@/features/auth/constants/auth-status";
import { formatUser } from "@/features/auth/utils/format-user";

const AuthContext = createContext(null);

const PUBLIC_ROUTES = new Set(["/sign-in", "/sign-up"]);

export function AuthProvider({ children }) {
    const pathname = usePathname();

    const [user, setUser] = useState(null);
    const [status, setStatus] = useState(AUTH_STATUS.LOADING);

    const requestRef = useRef(null);
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    const loadUser = useCallback(async () => {
        if (PUBLIC_ROUTES.has(pathname)) {
            if (mountedRef.current) {
                setUser(null);
                setStatus(AUTH_STATUS.UNAUTHENTICATED);
            }
            return null;
        }

        if (requestRef.current) {
            return requestRef.current;
        }

        setStatus(AUTH_STATUS.LOADING);

        requestRef.current = (async () => {
            try {
                const currentUser = await fetchCurrentUser();

                if (!mountedRef.current) {
                    return null;
                }
                setUser(formatUser(currentUser));
                setStatus(AUTH_STATUS.AUTHENTICATED);
                return currentUser;
            } catch (error) {
                if (!mountedRef.current) {
                    return null;
                }

                setUser(null);
                setStatus(AUTH_STATUS.UNAUTHENTICATED);

                return null;
            } finally {
                requestRef.current = null;
            }
        })();

        return requestRef.current;
    }, [pathname]);

    const logout = useCallback(async () => {
        try {
            await logoutRequest();
        } finally {
            if (mountedRef.current) {
                setUser(null);
                setStatus(AUTH_STATUS.UNAUTHENTICATED);
            }
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const value = useMemo(
        () => ({
            user,
            loadUser,
            logout,

            isLoading: status === AUTH_STATUS.LOADING,
            isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
            isUnauthenticated: status === AUTH_STATUS.UNAUTHENTICATED,
        }),
        [user, status, loadUser, logout],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }

    return context;
}
