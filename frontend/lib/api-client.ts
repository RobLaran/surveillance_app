import { API_ERRORS } from "@/constants/api-errors";

let refreshPromise: Promise<boolean> | null = null;

export interface ApiError {
    message: string;
    errors?: Record<string, string> | string[];
    status: number;
}

export interface ApiResponseBody {
    message?: string;
    errors?: Record<string, string> | string[];
}

type ApiOptions = RequestInit & {
    auth?: boolean;
};

type ApiResponse<T = unknown> = {
    response: Response;
    data: T;
};

// =========================
// REFRESH ACCESS TOKEN
// =========================
async function refreshAccessToken(): Promise<boolean> {
    try {
        const res = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });

        return res.ok;
    } catch {
        return false;
    }
}

// =========================
// API CLIENT
// =========================
async function apiClientInternal<T extends ApiResponseBody = ApiResponseBody>(
    endpoint: string,
    options: ApiOptions = {},
    isRetry = false,
): Promise<ApiResponse<T>> {
    const { auth = true, ...fetchOptions } = options;

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 10_000);

    let response: Response;

    try {
        response = await fetch(endpoint, {
            ...fetchOptions,
            credentials: "include",
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeout);
    }

    // Access token expired → refresh and retry once
    if (auth && response.status === 401 && !isRetry) {
        refreshPromise ??= refreshAccessToken();

        const refreshed = await refreshPromise;
        refreshPromise = null;

        if (refreshed) {
            return apiClientInternal<T>(endpoint, options, true);
        }

        if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/sign-in" &&
            window.location.pathname !== "/sign-up"
        ) {
            window.location.href = "/sign-in";
        }

        throw new Error(API_ERRORS.UNAUTHENTICATED);
    }

    if (response.status === 500) {
        throw new Error(API_ERRORS.INTERNAL_SERVER_ERROR);
    }

    let data: T | null = null;

    try {
        data = (await response.json()) as T;
    } catch {
        // Ignore empty response body
    }

    if (!response.ok) {
        const error: ApiError = {
            message: data?.message ?? "Request failed",
            errors: data?.errors,
            status: response.status,
        };

        throw error;
    }

    return {
        response,
        data: data as T,
    };
}

export const request = {
    get<TResponse extends ApiResponseBody = ApiResponseBody>(
        url: string,
        options: ApiOptions = {},
    ) {
        return apiClientInternal<TResponse>(url, {
            method: "GET",
            ...options,
        });
    },

    post<TResponse extends ApiResponseBody = ApiResponseBody, TBody = unknown>(
        url: string,
        data?: TBody | FormData,
        options: ApiOptions = {},
    ) {
        const isFormData = data instanceof FormData;

        return apiClientInternal<TResponse>(url, {
            method: "POST",
            headers: isFormData
                ? options.headers
                : {
                      "Content-Type": "application/json",
                      ...options.headers,
                  },
            body:
                data == null
                    ? undefined
                    : isFormData
                      ? data
                      : JSON.stringify(data),
            ...options,
        });
    },

    put<TResponse extends ApiResponseBody = ApiResponseBody, TBody = unknown>(
        url: string,
        data?: TBody | FormData,
        options: ApiOptions = {},
    ) {
        const isFormData = data instanceof FormData;

        return apiClientInternal<TResponse>(url, {
            method: "PUT",
            headers: isFormData
                ? options.headers
                : {
                      "Content-Type": "application/json",
                      ...options.headers,
                  },
            body:
                data == null
                    ? undefined
                    : isFormData
                      ? data
                      : JSON.stringify(data),
            ...options,
        });
    },

    patch<TResponse extends ApiResponseBody = ApiResponseBody, TBody = unknown>(
        url: string,
        data?: TBody,
        options: ApiOptions = {},
    ) {
        return apiClientInternal<TResponse>(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            body: data == null ? undefined : JSON.stringify(data),
            ...options,
        });
    },

    delete<TResponse extends ApiResponseBody = ApiResponseBody>(
        url: string,
        options: ApiOptions = {},
    ) {
        return apiClientInternal<TResponse>(url, {
            method: "DELETE",
            ...options,
        });
    },
};
