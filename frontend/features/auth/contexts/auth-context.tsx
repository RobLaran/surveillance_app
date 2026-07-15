"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import {
    fetchCurrentUserRequest,
    logoutRequest,
} from "@/features/auth/services/auth-service";
import { AUTH_STATUS } from "@/features/auth/constants/auth-status";
import { formatUser } from "@/features/auth/utils/format-user";
import { User } from "@/features/auth/types/auth";

type AuthContextType = {
    user: User | null;
    refreshUser: () => Promise<User | null>;
    logout: () => Promise<void>;
    isInitializing: boolean;
    isRefreshing: boolean;
    isAuthenticated: boolean;
    isUnauthenticated: boolean;
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

const PUBLIC_ROUTES = new Set<string>(["/sign-in", "/sign-up"]);

export function AuthProvider({ children }: AuthProviderProps) {
    const pathname = usePathname();

    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState<AuthStatus>(AUTH_STATUS.INITIALIZING);

    const requestRef = useRef<Promise<User | null> | null>(null);
    const mountedRef = useRef<boolean>(false);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    const fetchUser = useCallback(async (): Promise<User | null> => {
        if (requestRef.current) {
            return requestRef.current;
        }

        requestRef.current = (async () => {
            try {
                const currentUser = await fetchCurrentUserRequest();
                const formattedUser = formatUser(currentUser);

                if (!mountedRef.current) return null;

                setUser(formattedUser);
                return formattedUser;
            } finally {
                requestRef.current = null;
            }
        })();

        return requestRef.current;
    }, []);

    const initAuth = useCallback(async () => {
        if (PUBLIC_ROUTES.has(pathname)) {
            setUser(null);
            setStatus(AUTH_STATUS.UNAUTHENTICATED);
            return null;
        }

        setStatus(AUTH_STATUS.INITIALIZING);

        try {
            const user = await fetchUser();

            setStatus(AUTH_STATUS.AUTHENTICATED);

            return user;
        } catch {
            setUser(null);
            setStatus(AUTH_STATUS.UNAUTHENTICATED);

            return null;
        }
    }, [pathname, fetchUser]);

    const refreshUser = useCallback(async () => {
        setStatus(AUTH_STATUS.REFRESHING);

        try {
            const user = await fetchUser();

            setStatus(AUTH_STATUS.AUTHENTICATED);

            return user;
        } catch (error) {
            // Keep existing user.
            setStatus(AUTH_STATUS.AUTHENTICATED);

            throw error;
        }
    }, [fetchUser]);

    const logout = useCallback(async (): Promise<void> => {
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
        void initAuth();
    }, [initAuth]);

    const value = useMemo<AuthContextType>(
        () => ({
            user,
            refreshUser,
            logout,
            isInitializing: status === AUTH_STATUS.INITIALIZING,
            isRefreshing: status === AUTH_STATUS.REFRESHING,
            isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
            isUnauthenticated: status === AUTH_STATUS.UNAUTHENTICATED,
        }),
        [user, status, initAuth, refreshUser, logout],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }

    return context;
}
