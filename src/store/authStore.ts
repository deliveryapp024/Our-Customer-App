import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { authApi, setAuthToken } from '../api';
import type { User, AuthState } from '../types';

interface AuthActions {
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    setOnboardingComplete: (complete: boolean) => void;
    requestOTP: (phone: string) => Promise<{ success: boolean; error?: string; devOtp?: string }>;
    verifyOTP: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    // Initial state
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
    onboardingComplete: false,

    // Actions
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token, isAuthenticated: !!token }),
    setLoading: (isLoading) => set({ isLoading }),
    setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),

    requestOTP: async (phone: string) => {
        try {
            const response = await authApi.requestOTP(phone);
            if (response.success) {
                // Backend responses vary:
                // 1) { success: true, data: { otp?: string } }
                // 2) { success: true, otp?: string }  (no data envelope)
                const devOtp =
                    (response as any).data?.otp ??
                    (response as any).otp ??
                    undefined;
                return {
                    success: true,
                    devOtp, // Only present in dev mode (if backend returns it)
                };
            }
            return {
                success: false,
                error: response.error,
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to request OTP';
            return {
                success: false,
                error: message,
            };
        }
    },

    verifyOTP: async (phone: string, otp: string) => {
        try {
            const response = await authApi.verifyOTP(phone, otp);
            if (response.success) {
                // Backend responses vary:
                // 1) { success: true, data: { token, user } }
                // 2) { success: true, token, user } (no data envelope)
                const payload = (response as any).data ?? response;
                const { token, user } = payload;

                if (!token || !user) {
                    return { success: false, error: 'Invalid server response (missing token/user)' };
                }

                // Handle token object {accessToken, refreshToken} or string (backward compat)
                let accessToken: string;
                let refreshToken: string | null = null;

                if (typeof token === 'string') {
                    // Backward compatibility: old server format
                    accessToken = token;
                } else {
                    // New format: token object with accessToken and refreshToken
                    accessToken = token.accessToken;
                    refreshToken = token.refreshToken;
                }

                // Store tokens in AsyncStorage
                await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
                if (refreshToken) {
                    await AsyncStorage.setItem('@refresh_token', refreshToken);
                }
                await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

                // Set token in API client for future requests (Authorization: Bearer <token>)
                setAuthToken(accessToken);

                set({
                    user: {
                        id: user._id,
                        phone: String(user.phone),
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt,
                    },
                    token: accessToken,
                    isAuthenticated: true,
                });

                return { success: true };
            }
            return {
                success: false,
                error: response.error,
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to verify OTP';
            return {
                success: false,
                error: message,
            };
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.AUTH_TOKEN,
                STORAGE_KEYS.USER_DATA,
                STORAGE_KEYS.ONBOARDING_COMPLETE,
            ]);

            // Clear auth token from API client
            setAuthToken(null);

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                onboardingComplete: false,
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    loadStoredAuth: async () => {
        try {
            const [token, userData, onboardingComplete] = await AsyncStorage.multiGet([
                STORAGE_KEYS.AUTH_TOKEN,
                STORAGE_KEYS.USER_DATA,
                STORAGE_KEYS.ONBOARDING_COMPLETE,
            ]);

            if (token[1] && userData[1]) {
                const user = JSON.parse(userData[1]);

                // Set token in API client for future requests
                setAuthToken(token[1]);

                set({
                    token: token[1],
                    user,
                    isAuthenticated: true,
                    onboardingComplete: onboardingComplete[1] === 'true',
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Load auth error:', error);
            set({ isLoading: false });
        }
    },
}));
