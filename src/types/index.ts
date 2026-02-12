// User types
export interface User {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    profileImage?: string;
    profileImageType?: 'upload' | 'avatar';
    profileAvatarId?: string;
    dietaryPreferences?: DietaryPreference[];
    createdAt: string;
}

export type DietaryPreference = 'veg' | 'non-veg' | 'vegan' | 'eggetarian';

// Auth types
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    onboardingComplete: boolean;
}

// Location types
export interface Location {
    id: string;
    label: string;
    address: string;
    landmark?: string;
    latitude: number;
    longitude: number;
    type: 'home' | 'work' | 'other';
    isDefault: boolean;
}

// Restaurant types
export interface Restaurant {
    id: string;
    name: string;
    image: string;
    rating: number;
    cuisines: string[];
    deliveryTime: string;
    distance: string;
    priceLevel: '₹' | '₹₹' | '₹₹₹';
    isOpen: boolean;
    offers?: Offer[];
}

export interface Offer {
    id: string;
    code: string;
    description: string;
    discountPercent?: number;
    discountAmount?: number;
}

// Menu types
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    isVeg: boolean;
    isBestseller?: boolean;
    isAvailable: boolean;
}

// Cart types
export interface CartItem {
    menuItem: MenuItem;
    quantity: number;
    customizations?: string[];
}

export interface Cart {
    restaurantId: string;
    restaurantName: string;
    items: CartItem[];
    totalAmount: number;
}

// Order types
export type OrderStatus =
    | 'placed'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';

export interface Order {
    id: string;
    orderNumber: string;
    restaurant: Restaurant;
    items: CartItem[];
    status: OrderStatus;
    totalAmount: number;
    deliveryAddress: Location;
    placedAt: string;
    estimatedDelivery: string;
    driver?: {
        name: string;
        phone: string;
        image?: string;
    };
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    totalPages: number;
    totalItems: number;
}
