import api from './client';

// Types
export interface RequestOTPRequest {
    phone: string;
}

export interface RequestOTPResponse {
    message: string;
    otp?: string; // Only in development
}

export interface VerifyOTPRequest {
    phone: string;
    otp: string;
}

export interface TokenData {
    accessToken: string;
    refreshToken: string;
}

export interface VerifyOTPResponse {
    // Server returns token as object {accessToken, refreshToken}
    // But we keep backward compatibility for string token
    token: TokenData | string;
    user: {
        _id: string;
        phone: string;
        name?: string;
        email?: string;
        createdAt: string;
        role?: string;
        isActivated?: boolean;
    };
}

// Request OTP
// Note: BASE_URL already includes /api prefix, so we use /auth/otp/request (not /api/auth/otp/request)
export const requestOTP = async (phone: string) => {
    return api.post<RequestOTPResponse>('/auth/otp/request', { phone });
};

// Verify OTP
export const verifyOTP = async (phone: string, otp: string) => {
    return api.post<VerifyOTPResponse>('/auth/otp/verify', { phone, otp });
};

// Refresh token (for future use)
export const refreshToken = async () => {
    return api.post<{ token: string }>('/auth/refresh-token', {});
};

export default {
    requestOTP,
    verifyOTP,
    refreshToken,
};
