// App-wide constants
export const APP_NAME = 'CustomerApp';

// API Configuration
export const API_CONFIG = {
    BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://api.yourapp.com/api',
    TIMEOUT: 30000,
};

// Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: '@auth_token',
    USER_DATA: '@user_data',
    ONBOARDING_COMPLETE: '@onboarding_complete',
    LOCATION_DATA: '@location_data',
    CART_DATA: '@cart_data',
};

// Screen Names
export const SCREENS = {
    // Auth Stack
    WELCOME: 'Welcome',
    MOBILE_INPUT: 'MobileInput',
    OTP_VERIFICATION: 'OtpVerification',
    PROFILE_SETUP: 'ProfileSetup',
    DIETARY_PREFERENCES: 'DietaryPreferences',
    LOCATION_PICKER: 'LocationPicker',

    // Main Stack
    HOME: 'Home',
    SEARCH: 'Search',
    RESTAURANT_DETAIL: 'RestaurantDetail',
    CHECKOUT: 'Checkout',
    ORDER_SUCCESS: 'OrderSuccess',

    // Tracking
    TRACKING: 'Tracking',
    RATE_REVIEW: 'RateReview',

    // Profile
    PROFILE: 'Profile',
    HELP_SUPPORT: 'HelpSupport',
    ORDER_CANCELLED: 'OrderCancelled',
    PAYMENTS_HUB: 'PaymentsHub',
    SETTINGS: 'Settings',
    FAVORITES: 'Favorites',
    SAVED_ADDRESSES: 'SavedAddresses',
    ORDER_HISTORY: 'OrderHistory',

    // Tab Names
    HOME_TAB: 'HomeTab',
    ORDERS_TAB: 'OrdersTab',
    SEARCH_TAB: 'SearchTab',
    PROFILE_TAB: 'ProfileTab',
} as const;

// Navigation Stack Names
export const STACKS = {
    AUTH: 'AuthStack',
    MAIN: 'MainStack',
    HOME: 'HomeStack',
} as const;
