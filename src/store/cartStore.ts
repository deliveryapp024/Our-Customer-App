import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import type { CartItem, MenuItem } from '../types';

interface CartState {
    restaurantId: string | null;
    restaurantName: string | null;
    items: CartItem[];
    couponCode: string | null;
    isLoading: boolean;
}

interface CartActions {
    addItem: (restaurantId: string, restaurantName: string, item: MenuItem) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    setCouponCode: (code: string | null) => void;
    loadCart: () => Promise<void>;
    saveCart: () => Promise<void>;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState & CartActions>((set, get) => ({
    // Initial state
    restaurantId: null,
    restaurantName: null,
    items: [],
    couponCode: null,
    isLoading: false,

    // Actions
    addItem: (restaurantId, restaurantName, item) => {
        const state = get();

        // If adding from different restaurant, clear cart
        if (state.restaurantId && state.restaurantId !== restaurantId) {
            set({
                restaurantId,
                restaurantName,
                items: [{ menuItem: item, quantity: 1 }],
                couponCode: null, // coupon cannot carry across restaurants
            });
        } else {
            // Check if item already exists
            const existingIndex = state.items.findIndex(
                (cartItem) => cartItem.menuItem.id === item.id,
            );

            if (existingIndex >= 0) {
                // Increase quantity
                const newItems = [...state.items];
                newItems[existingIndex].quantity += 1;
                set({ items: newItems });
            } else {
                // Add new item
                set({
                    restaurantId,
                    restaurantName,
                    items: [...state.items, { menuItem: item, quantity: 1 }],
                });
            }
        }

        // Persist to storage
        get().saveCart();
    },

    removeItem: (itemId) => {
        const state = get();
        const existingIndex = state.items.findIndex(
            (cartItem) => cartItem.menuItem.id === itemId,
        );

        if (existingIndex >= 0) {
            const newItems = [...state.items];
            if (newItems[existingIndex].quantity > 1) {
                newItems[existingIndex].quantity -= 1;
                set({ items: newItems });
            } else {
                newItems.splice(existingIndex, 1);
                if (newItems.length === 0) {
                    set({ restaurantId: null, restaurantName: null, items: [] });
                } else {
                    set({ items: newItems });
                }
            }
            get().saveCart();
        }
    },

    updateQuantity: (itemId, quantity) => {
        const state = get();
        const existingIndex = state.items.findIndex(
            (cartItem) => cartItem.menuItem.id === itemId,
        );

        if (existingIndex >= 0) {
            if (quantity <= 0) {
                get().removeItem(itemId);
            } else {
                const newItems = [...state.items];
                newItems[existingIndex].quantity = quantity;
                set({ items: newItems });
                get().saveCart();
            }
        }
    },

    clearCart: () => {
        set({ restaurantId: null, restaurantName: null, items: [], couponCode: null });
        AsyncStorage.removeItem(STORAGE_KEYS.CART_DATA);
    },

    setCouponCode: (code) => {
        const normalized = code ? String(code).trim().toUpperCase() : null;
        set({ couponCode: normalized });
        get().saveCart();
    },

    loadCart: async () => {
        try {
            set({ isLoading: true });
            const cartData = await AsyncStorage.getItem(STORAGE_KEYS.CART_DATA);
            if (cartData) {
                const parsed = JSON.parse(cartData);
                set({
                    restaurantId: parsed.restaurantId,
                    restaurantName: parsed.restaurantName,
                    items: parsed.items,
                    couponCode: parsed.couponCode || null,
                });
            }
        } catch (error) {
            console.error('Load cart error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    saveCart: async () => {
        try {
            const state = get();
            await AsyncStorage.setItem(
                STORAGE_KEYS.CART_DATA,
                JSON.stringify({
                    restaurantId: state.restaurantId,
                    restaurantName: state.restaurantName,
                    items: state.items,
                    couponCode: state.couponCode,
                }),
            );
        } catch (error) {
            console.error('Save cart error:', error);
        }
    },

    getTotal: () => {
        return get().items.reduce(
            (sum, item) => sum + item.menuItem.price * item.quantity,
            0,
        );
    },

    getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },
}));
