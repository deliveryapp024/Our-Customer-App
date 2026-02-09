import { API_CONFIG } from '../constants';

// API Response types
export interface ApiError {
    message: string;
    error?: string;
}

export interface ApiResult<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiFailure {
    success: false;
    error: string;
}

export type ApiResponse<T> = ApiResult<T> | ApiFailure;

// Get auth token from storage (for later use with AsyncStorage)
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

// Base request function
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Dev-only debug logging for x-request-id header
        if (__DEV__) {
            const requestId = response.headers.get('x-request-id');
            const method = options.method || 'GET';
            if (requestId) {
                // Add extra context for auth and order calls
                const isAuthCall = endpoint.includes('/auth');
                const isOrderCall = endpoint.includes('/order');
                let extraContext = '';
                if (isAuthCall) {
                    extraContext = ' [Auth Call]';
                } else if (isOrderCall) {
                    extraContext = ' [Order Call]';
                }
                console.log(`[API Debug] ${method} ${endpoint} - x-request-id: ${requestId}${extraContext}`);
            }
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            return {
                success: false,
                error: data?.message || `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        // Handle both enveloped and non-enveloped responses
        if (data && typeof data.success === 'boolean') {
            return data as ApiResponse<T>;
        }

        // Non-enveloped response - wrap it
        return {
            success: true,
            data: data as T,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Network error';
        return {
            success: false,
            error: message,
        };
    }
}

// HTTP methods
export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        }),

    patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
        }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
