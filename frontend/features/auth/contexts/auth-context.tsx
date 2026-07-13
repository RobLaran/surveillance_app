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
    fetchCurrentUser,
    logoutRequest,
} from "@/features/auth/services/auth-service";
import { AUTH_STATUS } from "@/features/auth/constants/auth-status";
import { formatUser } from "@/features/auth/utils/format-user";
import { CurrentUser } from "@/features/auth/types/auth";

type AuthContextType = {
    user: CurrentUser | null;
    loadUser: () => Promise<CurrentUser | null>;
    logout: () => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
    isUnauthenticated: boolean;
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = new Set<string>(["/sign-in", "/sign-up"]);

export function AuthProvider({ children }: AuthProviderProps) {
    const pathname = usePathname();

    const [user, setUser] = useState<CurrentUser | null>(null);
    const [status, setStatus] = useState<string>(AUTH_STATUS.LOADING);

    const requestRef = useRef<Promise<CurrentUser | null> | null>(null);
    const mountedRef = useRef<boolean>(false);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    const loadUser = useCallback(async (): Promise<CurrentUser | null> => {
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
                const formattedUser = formatUser(currentUser) as CurrentUser;

                if (!mountedRef.current) {
                    return null;
                }

                setUser(formattedUser);
                setStatus(AUTH_STATUS.AUTHENTICATED);

                return formattedUser;
            } catch {
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
        void loadUser();
    }, [loadUser]);

    const value = useMemo<AuthContextType>(
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

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }

    return context;
}
