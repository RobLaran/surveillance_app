import { API_ERRORS } from "@/constants/api-errors";

let refreshPromise = null;

// =========================
// REFRESH ACCESS TOKEN
// =========================
async function refreshAccessToken() {
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
async function apiClientInternal(endpoint, options = {}, isRetry = false) {
    const { auth = true, ...fetchOptions } = options;

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 10_000);

    let response;

    try {
        response = await fetch(endpoint, {
            ...options,
            credentials: "include",
            signal: controller.signal,
        });
    } catch (err) {
        throw err;
    } finally {
        clearTimeout(timeout);
    }

    // Access token expired → refresh and retry once
    if (auth && response.status === 401 && !isRetry) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            return apiClientInternal(endpoint, options, true);
        }

        if (typeof window !== "undefined") {
            // Check if we aren't already on the sign-in page to prevent infinite redirect loops
            if (
                window.location.pathname !== "/sign-in" ||
                window.location.pathname !== "/sign-up"
            ) {
                window.location.href = "/sign-in";
            }
        }

        throw new Error(API_ERRORS.UNAUTHENTICATED);
    }

    if (response.status === 500) {
        throw new Error(API_ERRORS.INTERNAL_SERVER_ERROR);
    }

    let data = null;

    try {
        data = await response.json();
    } catch {
        // Ignore empty response bodies
    }

    if (!response.ok) {
        throw {
            message: data.message,
            errors: data.errors,
            status: response.status,
        };
    }

    return { response, data };
}

export const request = {
    get(url, options = {}) {
        return apiClientInternal(url, {
            method: "GET",
            ...options,
        });
    },

    post(url, data, options = {}) {
        const isFormData = data instanceof FormData;

        return apiClientInternal(url, {
            method: "POST",
            headers: isFormData
                ? options.headers
                : {
                      "Content-Type": "application/json",
                      ...options.headers,
                  },
            body: isFormData ? data : JSON.stringify(data),
            ...options,
        });
    },

    put(url, data, options = {}) {
        const isFormData = data instanceof FormData;

        return apiClientInternal(url, {
            method: "PUT",
            headers: isFormData
                ? options.headers
                : {
                      "Content-Type": "application/json",
                      ...options.headers,
                  },
            body: isFormData ? data : JSON.stringify(data),
            ...options,
        });
    },

    patch(url, data, options = {}) {
        return apiClientInternal(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            body: JSON.stringify(data),
            ...options,
        });
    },

    delete(url, options = {}) {
        return apiClientInternal(url, {
            method: "DELETE",
            ...options,
        });
    },
};
