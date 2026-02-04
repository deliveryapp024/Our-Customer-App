import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import type { User, AuthState } from '../types';

interface AuthActions {
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    setOnboardingComplete: (complete: boolean) => void;
    login: (phone: string, otp: string) => Promise<boolean>;
    logout: () => Promise<void>;
    loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
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

    login: async (phone: string, _otp: string) => {
        try {
            set({ isLoading: true });

            // TODO: Replace with actual API call
            // Simulating API response
            const mockUser: User = {
                id: '1',
                phone,
                createdAt: new Date().toISOString(),
            };
            const mockToken = 'mock_token_' + Date.now();

            // Store in AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));

            set({
                user: mockUser,
                token: mockToken,
                isAuthenticated: true,
                isLoading: false,
            });

            return true;
        } catch (error) {
            console.error('Login error:', error);
            set({ isLoading: false });
            return false;
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.AUTH_TOKEN,
                STORAGE_KEYS.USER_DATA,
                STORAGE_KEYS.ONBOARDING_COMPLETE,
            ]);
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
                set({
                    token: token[1],
                    user: JSON.parse(userData[1]),
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
