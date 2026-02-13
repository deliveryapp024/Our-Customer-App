import api from './client';

// Types for Restaurant/Seller
export interface Restaurant {
    _id: string;
    name: string;
    storeName?: string;
    image?: string;
    rating?: number;
    cuisines?: string[];
    deliveryTime?: string;
    priceLevel?: string;
    address?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    isActive?: boolean;
    publicProfile?: {
        tagline?: string;
        description?: string;
        cuisines?: string[];
        priceForTwo?: number;
        heroMedia?: {
            type?: 'image' | 'video';
            url?: string;
            thumbnailUrl?: string;
            aspectRatio?: string;
        };
        coupons?: Array<{
            couponCode: string;
            displayOrder?: number;
            backgroundColor?: string;
            textColor?: string;
            badgeText?: string;
        }>;
        cacheConfig?: {
            ttlSeconds?: number;
            isEnabled?: boolean;
        };
        profileUpdatedAt?: string;
    };
}

export interface MenuItem {
    _id: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image?: string;
    isVeg?: boolean;
    foodType?: 'veg' | 'nonveg' | 'egg';
    isBestseller?: boolean;
    category?: string;
    isAvailable?: boolean;
}

export interface RestaurantMenu {
    restaurant: Restaurant;
    categories: string[];
    items: MenuItem[];
}

export interface NearbyRestaurantsParams {
    latitude: number;
    longitude: number;
    radius?: number; // in km
}

// Fetch nearby restaurants
export const fetchNearbyRestaurants = async (params: NearbyRestaurantsParams) => {
    const { latitude, longitude, radius = 10 } = params;
    return api.get<Restaurant[]>(
        `/seller/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
};

// Fetch restaurant details
export const fetchRestaurantDetails = async (restaurantId: string) => {
    return api.get<Restaurant>(`/seller/${restaurantId}`);
};

// Fetch restaurant menu
export const fetchRestaurantMenu = async (restaurantId: string) => {
    return api.get<RestaurantMenu>(`/seller/${restaurantId}/menu`);
};

export default {
    fetchNearbyRestaurants,
    fetchRestaurantDetails,
    fetchRestaurantMenu,
};
