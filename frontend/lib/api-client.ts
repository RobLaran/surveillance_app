import { API_ERRORS } from "@/constants/api-errors";

let refreshPromise: Promise<boolean> | null = null;

export class ApiError extends Error {
    status: number;
    errors?: Record<string, string> | string[];

    constructor(
        message: string,
        status: number,
        errors?: Record<string, string> | string[],
    ) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
    }
}

// Every backend response follows this envelope:
// { success, message, data?, errors? }
export interface ApiResponseBody<TData = unknown> {
    success: boolean;
    message: string;
    data: TData;
    errors?: Record<string, string> | string[];
}

type ApiOptions = RequestInit & {
    auth?: boolean;
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
async function apiClientInternal<TData = unknown>(
    endpoint: string,
    options: ApiOptions = {},
    isRetry = false,
): Promise<ApiResponseBody<TData>> {
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
    } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
            throw new ApiError(API_ERRORS.TIMEOUT ?? "Request timed out", 408);
        }
        throw err;
    } finally {
        clearTimeout(timeout);
    }

    // Access token expired → refresh and retry once
    if (auth && response.status === 401 && !isRetry) {
        refreshPromise ??= refreshAccessToken();

        const refreshed = await refreshPromise;
        refreshPromise = null;

        if (refreshed) {
            return apiClientInternal<TData>(endpoint, options, true);
        }

        if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/sign-in" &&
            window.location.pathname !== "/sign-up"
        ) {
            window.location.href = "/sign-in";
        }

        throw new ApiError(API_ERRORS.UNAUTHENTICATED, 401);
    }

    if (response.status === 500) {
        throw new ApiError(API_ERRORS.INTERNAL_SERVER_ERROR, 500);
    }

    let body: ApiResponseBody<TData> | null = null;

    try {
        body = (await response.json()) as ApiResponseBody<TData>;
    } catch {
        // Ignore empty response body
    }

    // Two independent failure signals from the backend:
    // 1. HTTP status not ok (e.g. 401, 404, 422, 409)
    // 2. Body says success: false, even on a 200 (defensive — in case
    //    any route ever returns 200 with a logical failure body)
    if (!response.ok || body?.success === false) {
        throw new ApiError(
            body?.message ?? "Request failed",
            response.status,
            body?.errors,
        );
    }

    if (!body) {
        throw new ApiError("Empty response from server", response.status);
    }

    return body;
}

// Merge extra headers/body out of `options` BEFORE spreading the rest,
// so a caller-supplied header (e.g. Authorization) can't silently wipe
// out Content-Type or the request body we just built.
function buildBodyOptions(
    method: string,
    data: unknown,
    options: ApiOptions,
): ApiOptions {
    const {
        headers: extraHeaders,
        body: _ignoredBody,
        ...restOptions
    } = options;
    const isFormData = data instanceof FormData;

    return {
        method,
        headers: isFormData
            ? extraHeaders
            : {
                  "Content-Type": "application/json",
                  ...extraHeaders,
              },
        body:
            data == null
                ? undefined
                : isFormData
                  ? (data as FormData)
                  : JSON.stringify(data),
        ...restOptions,
    };
}

export const request = {
    get<TData = unknown>(url: string, options: ApiOptions = {}) {
        return apiClientInternal<TData>(url, {
            method: "GET",
            ...options,
        });
    },

    post<TData = unknown, TBody = unknown>(
        url: string,
        data?: TBody | FormData,
        options: ApiOptions = {},
    ) {
        return apiClientInternal<TData>(
            url,
            buildBodyOptions("POST", data, options),
        );
    },

    put<TData = unknown, TBody = unknown>(
        url: string,
        data?: TBody | FormData,
        options: ApiOptions = {},
    ) {
        return apiClientInternal<TData>(
            url,
            buildBodyOptions("PUT", data, options),
        );
    },

    patch<TData = unknown, TBody = unknown>(
        url: string,
        data?: TBody,
        options: ApiOptions = {},
    ) {
        return apiClientInternal<TData>(
            url,
            buildBodyOptions("PATCH", data, options),
        );
    },

    delete<TData = unknown>(url: string, options: ApiOptions = {}) {
        return apiClientInternal<TData>(url, {
            method: "DELETE",
            ...options,
        });
    },
};
