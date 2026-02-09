// App-wide constants
export const APP_NAME = 'CustomerApp';

export const API_CONFIG = {
    // IMPORTANT:
    // - Most backend routes are under /api (e.g. POST /api/auth/otp/test)
    // - Health endpoint is /health (no /api prefix)
    API_ORIGIN: __DEV__ ? 'http://10.0.2.2:5000' : 'http://144.91.71.57:5000',
    API_PREFIX: '/api',
    // Back-compat: treat BASE_URL as origin+prefix for API calls.
    BASE_URL: (__DEV__ ? 'http://10.0.2.2:5000' : 'http://144.91.71.57:5000') + '/api',
    TIMEOUT: 30000,
};

export const STORAGE_KEYS = {
    AUTH_TOKEN: '@auth_token',
    USER_DATA: '@user_data',
    ONBOARDING_COMPLETE: '@onboarding_complete',
    LOCATION_DATA: '@location_data',
    CART_DATA: '@cart_data',
};

export const SCREENS = {
    // Auth
    WELCOME: 'Welcome', MOBILE_INPUT: 'MobileInput', OTP_VERIFICATION: 'OtpVerification',
    PROFILE_SETUP: 'ProfileSetup', DIETARY_PREFERENCES: 'DietaryPreferences', LOCATION_PICKER: 'LocationPicker',
    // Main
    HOME: 'Home', SEARCH: 'Search', RESTAURANT_DETAIL: 'RestaurantDetail',
    CHECKOUT: 'Checkout', ORDER_SUCCESS: 'OrderSuccess', COUPONS_WALLET: 'CouponsWallet',
    // Home Features
    BOLT_DELIVERY: 'BoltDelivery', NINETY_NINE_STORE: 'NinetyNineStore', FLASH_DEALS: 'FlashDeals',
    GROUP_ORDER: 'GroupOrder', AI_COMBO: 'AICombo', DINE_IN: 'DineIn', SMART_FILTERS: 'SmartFilters',
    TRAIN_DELIVERY: 'TrainDelivery', QUICK_REORDER: 'QuickReorder', FOOD_STORIES: 'FoodStories',
    // Restaurant
    FAN_CLUB: 'FanClub', TABLE_RESERVATION: 'TableReservation',
    // Tracking
    TRACKING: 'Tracking', RATE_REVIEW: 'RateReview',
    // Profile
    PROFILE: 'Profile', HELP_SUPPORT: 'HelpSupport', ORDER_CANCELLED: 'OrderCancelled',
    PAYMENTS_HUB: 'PaymentsHub', SETTINGS: 'Settings', FAVORITES: 'Favorites',
    SAVED_ADDRESSES: 'SavedAddresses', ORDER_HISTORY: 'OrderHistory', REFERRAL: 'Referral',
    ORDER_RECEIPT: 'OrderReceipt', ECO_DASHBOARD: 'EcoDashboard', EXPENSE_STATEMENTS: 'ExpenseStatements',
    // Errors
    PAYMENT_FAILED: 'PaymentFailed', GENERIC_ERROR: 'GenericError',
    LOCATION_UNSERVICEABLE: 'LocationUnserviceable', RESTAURANT_CLOSED: 'RestaurantClosed',
    // Tabs - 5 Bottom Navigation: Home, Food, Reorder, Deals, Profile
    HOME_TAB: 'HomeTab', FOOD_TAB: 'FoodTab', REORDER_TAB: 'ReorderTab', DEALS_TAB: 'DealsTab', PROFILE_TAB: 'ProfileTab',
} as const;

export const STACKS = { AUTH: 'AuthStack', MAIN: 'MainStack', HOME: 'HomeStack' } as const;
