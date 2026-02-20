import api from './client';

// Types for Order
export interface OrderItem {
    id?: string;
    item?: string;
    count: number;
    name?: string;
    price?: number;
}

export interface DeliveryLocation {
    latitude: number;
    longitude: number;
    address?: string;
}

export interface CreateOrderRequest {
    items: OrderItem[];
    branch: string;
    totalPrice: number;
    deliveryLocation?: DeliveryLocation;
    addressId?: string;
    idempotencyKey?: string; // Optional: prevents duplicate orders on retry
    couponCode?: string;
    fulfillmentType?: 'asap' | 'scheduled';
    scheduleAt?: string;
    paymentMethod?: 'cod' | 'upi_phonepe';
    paymentAttemptId?: string;
}

export interface Order {
    _id: string;
    customer: string;
    seller?: string;
    branch?: string;
    items: OrderItem[];
    totalPrice: number;
    deliveryFee?: number;
    status: 'pending_seller_approval' | 'seller_rejected' | 'available' | 'confirmed' | 'arriving' | 'delivered' | 'cancelled';
    deliveryLocation?: DeliveryLocation;
    deliveryPartner?: string;
    createdAt: string;
    updatedAt: string;
    fulfillmentType?: 'asap' | 'scheduled';
    scheduleAt?: string;
    scheduleWindowLabel?: string;
    paymentMethod?: 'cod' | 'upi_phonepe';
    paymentStatus?: 'pending' | 'success' | 'failed' | 'refunded' | 'not_applicable';
    paymentProvider?: string | null;
}

export interface QuoteRequest {
    branchId: string;
    deliveryLocation?: DeliveryLocation;
    cartValue?: number;
    vehicleType?: string;
    addressId?: string;
    couponCode?: string;
    // Optional: lets server validate coupon correctly without client needing category/seller ids.
    items?: OrderItem[];
    fulfillmentType?: 'asap' | 'scheduled';
    scheduleAt?: string;
}

export interface QuoteResponse {
    final_fee: number;
    agent_payout: number;
    platform_margin: number;
    applied_config_id?: string;
    breakdown?: {
        type: string;
        base_fare: number;
        distance_surcharge: number;
        small_order_surcharge: number;
        surge_applied: number;
        distance_km: number;
    };
    city?: string;
    distance_km?: number;
    coupon?: {
        _id?: string;
        code: string;
        name?: string;
        description?: string;
        type?: string;
        displayDiscount?: string;
    } | null;
    subtotal?: number;
    discountAmount?: number;
    finalSubtotal?: number;
    freeDeliveryApplied?: boolean;
    fulfillmentType?: 'asap' | 'scheduled';
    scheduleAt?: string | null;
    scheduleWindowLabel?: string | null;
}

export interface ScheduleSlot {
    startAt: string;
    endAt: string;
    label: string;
    isAvailable: boolean;
    remainingCapacity: number;
    capacityPerSlot: number;
}

export interface ScheduleSlotsResponse {
    slotSizeMinutes: number;
    timezone: string;
    slots: ScheduleSlot[];
}

// Create order
export const createOrder = async (data: CreateOrderRequest) => {
    return api.post<Order>('/order', data);
};

// Get order quote
export const getOrderQuote = async (data: QuoteRequest) => {
    return api.post<QuoteResponse>('/order/quote', data);
};

// Get schedule slots for a branch/day
export const getScheduleSlots = async (branchId: string, date: string) => {
    return api.get<ScheduleSlotsResponse>(`/order/schedule/slots?branchId=${encodeURIComponent(branchId)}&date=${encodeURIComponent(date)}`);
};

// Get all orders
export const getOrders = async () => {
    return api.get<Order[]>('/order');
};

// Get order by ID
export const getOrderById = async (orderId: string) => {
    return api.get<Order>(`/order/${orderId}`);
};

export const recoverOrderByIdempotency = async (idempotencyKey: string) => {
    return api.get<Order>(`/order/recover/${encodeURIComponent(idempotencyKey)}`);
};

// Confirm order (for delivery partner)
export const confirmOrder = async (orderId: string, deliveryPersonLocation?: DeliveryLocation) => {
    return api.post<Order>(`/order/${orderId}/confirm`, { deliveryPersonLocation });
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string, deliveryPersonLocation?: DeliveryLocation) => {
    return api.patch<Order>(`/order/${orderId}/status`, { status, deliveryPersonLocation });
};

export default {
    createOrder,
    getOrderQuote,
    getScheduleSlots,
    getOrders,
    getOrderById,
    recoverOrderByIdempotency,
    confirmOrder,
    updateOrderStatus,
};
