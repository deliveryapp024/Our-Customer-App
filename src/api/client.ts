import { API_CONFIG } from '../constants';
import { trackClientError, trackClientEvent } from '../utils/telemetry';

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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    const startedAt = Date.now();

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
            signal: controller.signal,
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
        const requestId = response.headers.get('x-request-id') || undefined;

        if (!response.ok) {
            trackClientError('api_response_error', {
                endpoint,
                method: options.method || 'GET',
                statusCode: response.status,
                requestId,
                durationMs: Date.now() - startedAt,
                message: data?.message || response.statusText,
            });
            return {
                success: false,
                error: data?.message || `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        trackClientEvent('api_response_success', {
            endpoint,
            method: options.method || 'GET',
            statusCode: response.status,
            requestId,
            durationMs: Date.now() - startedAt,
        });

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
        trackClientError('api_network_error', {
            endpoint,
            method: options.method || 'GET',
            durationMs: Date.now() - startedAt,
            message,
        });
        return {
            success: false,
            error: message,
        };
    } finally {
        clearTimeout(timeout);
    }
}

async function requestFormData<T>(
    endpoint: string,
    method: 'POST' | 'PATCH',
    body: FormData,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    const startedAt = Date.now();

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            method,
            headers,
            body,
            signal: controller.signal,
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
            const requestId = response.headers.get('x-request-id') || undefined;
            trackClientError('api_response_error', {
                endpoint,
                method,
                statusCode: response.status,
                requestId,
                durationMs: Date.now() - startedAt,
                message: data?.message || response.statusText,
            });
            return {
                success: false,
                error: data?.message || `HTTP ${response.status}: ${response.statusText}`,
            };
        }
        trackClientEvent('api_response_success', {
            endpoint,
            method,
            statusCode: response.status,
            requestId: response.headers.get('x-request-id') || undefined,
            durationMs: Date.now() - startedAt,
        });

        if (data && typeof data.success === 'boolean') {
            return data as ApiResponse<T>;
        }

        return {
            success: true,
            data: data as T,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Network error';
        trackClientError('api_network_error', {
            endpoint,
            method,
            durationMs: Date.now() - startedAt,
            message,
        });
        return {
            success: false,
            error: message,
        };
    } finally {
        clearTimeout(timeout);
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

    postFormData: <T>(endpoint: string, body: FormData, options?: RequestInit) =>
        requestFormData<T>(endpoint, 'POST', body, options),

    patchFormData: <T>(endpoint: string, body: FormData, options?: RequestInit) =>
        requestFormData<T>(endpoint, 'PATCH', body, options),
};

export default api;
