import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Linking,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SCREENS } from '../../../constants';
import { useCartStore } from '../../../store/cartStore';
import { ordersApi, paymentsApi } from '../../../api';
import { BackButton } from '../../../components/ui/BackButton';
import { useQuery } from '@tanstack/react-query';
import { trackClientError, trackClientEvent } from '../../../utils/telemetry';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: 'COD', description: 'Pay when you receive' },
    { id: 'upi_phonepe', name: 'UPI (PhonePe)', icon: 'UPI', description: 'Pay now via PhonePe' },
];

export const CheckoutScreen: React.FC<Props> = ({ navigation, route }) => {
    const { items, restaurantName, getTotal, clearCart, couponCode, setCouponCode } = useCartStore();
    const [selectedPayment, setSelectedPayment] = useState('cod'); // COD for Phase 0
    const [fulfillmentType, setFulfillmentType] = useState<'asap' | 'scheduled'>('asap');
    const [selectedScheduleDate, setSelectedScheduleDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [selectedSlot, setSelectedSlot] = useState<{ startAt: string; label: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState<string>('');

    // Get branch info from navigation params (preferred) or cart fallback
    const branchId = route.params?.branchId || useCartStore.getState().restaurantId;
    const deliveryLocation = route.params?.deliveryLocation;

    const subtotal = getTotal();
    const cartLineSavings = items.reduce((sum, item) => {
        const original = Number(item?.menuItem?.originalPrice || 0);
        const current = Number(item?.menuItem?.price || 0);
        const qty = Number(item?.quantity || 0);
        if (!Number.isFinite(original) || original <= current || qty <= 0) return sum;
        return sum + (original - current) * qty;
    }, 0);

    const orderItems = items.map(item => ({
        id: String(item.menuItem.id),
        item: String(item.menuItem.id),
        count: item.quantity,
        name: item.menuItem.name,
    }));

    const canQuote =
        !!branchId &&
        !!deliveryLocation &&
        Number.isFinite(Number(deliveryLocation?.latitude)) &&
        Number.isFinite(Number(deliveryLocation?.longitude)) &&
        orderItems.length > 0;

    const slotsQuery = useQuery({
        queryKey: ['scheduleSlots', String(branchId || ''), selectedScheduleDate],
        enabled: !!branchId && fulfillmentType === 'scheduled',
        queryFn: async () => {
            const res = await ordersApi.getScheduleSlots(String(branchId), selectedScheduleDate);
            if (!res.success) throw new Error(res.error || 'Failed to load schedule slots');
            return res.data;
        },
        staleTime: 30 * 1000,
    });

    const quoteQuery = useQuery({
        queryKey: ['orderQuote', String(branchId || ''), String(couponCode || ''), subtotal, deliveryLocation?.latitude, deliveryLocation?.longitude, orderItems.length, fulfillmentType, selectedSlot?.startAt || ''],
        enabled: canQuote,
        queryFn: async () => {
            const res = await ordersApi.getOrderQuote({
                branchId: String(branchId),
                deliveryLocation,
                cartValue: subtotal,
                vehicleType: 'Bike',
                couponCode: couponCode || undefined,
                items: orderItems,
                fulfillmentType,
                scheduleAt: fulfillmentType === 'scheduled' ? (selectedSlot?.startAt || undefined) : undefined,
            });
            if (!res.success) throw new Error(res.error || 'Failed to fetch quote');
            return res.data;
        },
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
    });

    const deliveryFee = quoteQuery.data?.final_fee ?? 0;
    const discount = quoteQuery.data?.discountAmount ?? 0;
    const finalSubtotal = quoteQuery.data?.finalSubtotal ?? subtotal;
    const totalSavings = Math.max(0, cartLineSavings + discount);
    const total = finalSubtotal + deliveryFee;
    const today = new Date();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const dayOptions = [
        { label: 'Today', value: today.toISOString().slice(0, 10) },
        { label: 'Tomorrow', value: tomorrow.toISOString().slice(0, 10) },
    ];

    // Generate idempotency key for this checkout session
    const [idempotencyKey] = useState(() => `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    const waitForPaymentSuccess = async (attemptId: string): Promise<{ success: boolean; error?: string }> => {
        const maxAttempts = 20;
        for (let i = 0; i < maxAttempts; i += 1) {
            const statusRes = await paymentsApi.getPaymentAttemptStatus(attemptId);
            if (!statusRes.success) {
                return { success: false, error: statusRes.error || 'Failed to verify payment status' };
            }
            const state = statusRes.data?.status;
            if (state === 'success') return { success: true };
            if (state === 'failed' || state === 'expired' || state === 'cancelled') {
                return { success: false, error: statusRes.data?.failureReason || 'Payment failed' };
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        return { success: false, error: 'Payment verification timed out. Please try again.' };
    };

    const withRetry = async <T,>(
        opName: string,
        fn: () => Promise<T>,
        attempts = 2,
    ): Promise<T> => {
        let lastError: any = null;
        for (let i = 0; i < attempts; i += 1) {
            try {
                const value = await fn();
                if (i > 0) {
                    trackClientEvent('checkout_retry_success', { opName, attempt: i + 1 });
                }
                return value;
            } catch (err) {
                lastError = err;
                trackClientError('checkout_retry_failed_attempt', {
                    opName,
                    attempt: i + 1,
                    message: err instanceof Error ? err.message : String(err),
                });
                if (i < attempts - 1) {
                    await new Promise((resolve) => setTimeout(resolve, 600 * (i + 1)));
                }
            }
        }
        throw lastError;
    };

    const handlePlaceOrder = async () => {
        if (!branchId) {
            Alert.alert('Error', 'Restaurant branchId is missing. Please re-open restaurant and try again.');
            return;
        }

        if (items.length === 0) {
            Alert.alert('Error', 'Your cart is empty');
            return;
        }
        if (fulfillmentType === 'scheduled' && !selectedSlot?.startAt) {
            Alert.alert('Select Slot', 'Please select a schedule slot before placing order.');
            return;
        }

        // Strict payload guard: every line must carry a real product id.
        const invalidItem = items.find((item) => !item?.menuItem?.id || String(item.menuItem.id).trim().length === 0);
        if (invalidItem) {
            Alert.alert('Error', 'One or more cart items have invalid product IDs. Please remove and add again.');
            return;
        }

        // Require a successful quote when we have enough data to quote.
        if (canQuote) {
            if (quoteQuery.isLoading) {
                Alert.alert('Please wait', 'Calculating delivery charges...');
                return;
            }
            if (quoteQuery.isError) {
                Alert.alert('Error', 'Unable to calculate delivery charges right now. Please pull to refresh and try again.');
                return;
            }
        }

        setIsProcessing(true);
        setProcessingStep('Preparing order');
        trackClientEvent('checkout_place_order_start', {
            branchId: String(branchId),
            itemCount: items.length,
            paymentMethod: selectedPayment,
            fulfillmentType,
        });

        let verifiedPaymentAttemptId: string | undefined;
        try {
        if (selectedPayment === 'upi_phonepe') {
            setProcessingStep('Starting payment');
            const paymentAttempt = await withRetry(
                'createPhonePePayment',
                async () => {
                    const response = await paymentsApi.createPhonePePayment({ amount: total });
                    if (!response.success) {
                        throw new Error(response.error || 'Unable to start PhonePe payment.');
                    }
                    return response;
                },
                2,
            );

            verifiedPaymentAttemptId = paymentAttempt.data.paymentAttemptId;
            const isImmediateSuccess =
                paymentAttempt.data.status === 'success' ||
                paymentAttempt.data.mock === true;
            if (paymentAttempt.data.disabled && !isImmediateSuccess) {
                setIsProcessing(false);
                Alert.alert('PhonePe Unavailable', 'UPI is currently disabled. Please choose Cash on Delivery for now.');
                return;
            }

            const redirect = paymentAttempt.data.redirectUrl;
            if (redirect) {
                try {
                    const canOpen = await Linking.canOpenURL(redirect);
                    if (canOpen) await Linking.openURL(redirect);
                } catch {
                    // Continue polling regardless of deep-link open result.
                }
            }

            if (!isImmediateSuccess) {
                setProcessingStep('Verifying payment');
                const paymentCheck = await waitForPaymentSuccess(verifiedPaymentAttemptId);
                if (!paymentCheck.success) {
                    setIsProcessing(false);
                    setProcessingStep('');
                    trackClientError('checkout_payment_failed', {
                        branchId: String(branchId),
                        paymentAttemptId: verifiedPaymentAttemptId,
                        message: paymentCheck.error || 'Payment failed',
                    });
                    Alert.alert('Payment Failed', paymentCheck.error || 'Payment was not completed.');
                    return;
                }
            }
        }

        if (__DEV__) {
            console.log('[Checkout] createOrder payload', {
                branchId: String(branchId),
                itemCount: orderItems.length,
                firstProductId: orderItems[0]?.id,
            });
        }

        // Create order with idempotency key (prevents duplicates on retry)
        setProcessingStep('Placing order');

        const result = await withRetry(
            'createOrder',
            async () => {
                const response = await ordersApi.createOrder({
                    items: orderItems,
                    branch: String(branchId),
                    // Server recomputes totals; this field is kept for backwards compatibility.
                    totalPrice: finalSubtotal,
                    deliveryLocation,
                    idempotencyKey, // Same key on retry = same order result
                    couponCode: couponCode || undefined,
                    fulfillmentType,
                    scheduleAt: fulfillmentType === 'scheduled' ? selectedSlot?.startAt : undefined,
                    paymentMethod: selectedPayment === 'upi_phonepe' ? 'upi_phonepe' : 'cod',
                    paymentAttemptId: verifiedPaymentAttemptId,
                });
                if (!response.success) {
                    throw new Error(response.error || 'Failed to place order');
                }
                return response;
            },
            2,
        );

        setIsProcessing(false);
        setProcessingStep('');

            const order = result.data;
            trackClientEvent('checkout_place_order_success', {
                orderId: order._id,
                paymentMethod: selectedPayment,
                fulfillmentType,
            });
            clearCart();
            setCouponCode(null);
            navigation.navigate(SCREENS.ORDER_SUCCESS, {
                orderId: order._id,
                total: total.toFixed(2),
                restaurantName,
            });
        } catch (error) {
            setIsProcessing(false);
            setProcessingStep('');
            const message = error instanceof Error ? error.message : 'Failed to place order. Please try again.';
            trackClientError('checkout_place_order_error', {
                branchId: String(branchId),
                paymentMethod: selectedPayment,
                message,
            });
            // Recovery flow: if create succeeded on server but response got lost, recover by idempotency key.
            const recovered = await ordersApi.recoverOrderByIdempotency(idempotencyKey);
            if (recovered.success && recovered.data?._id) {
                clearCart();
                setCouponCode(null);
                navigation.navigate(SCREENS.ORDER_SUCCESS, {
                    orderId: recovered.data._id,
                    total: total.toFixed(2),
                    restaurantName,
                });
                return;
            }
            Alert.alert('Order Failed', message);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Delivery Address */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Deliver to</Text>
                        <TouchableOpacity>
                            <Text style={styles.changeText}>CHANGE</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.addressCard}>
                        <Text style={styles.addressIcon}>Home</Text>
                        <View style={styles.addressInfo}>
                            <Text style={styles.addressLabel}>Home</Text>
                            <Text style={styles.addressText}>
                                45-2/A Main Street, Camp Area, Belagavi
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.orderCard}>
                        <Text style={styles.restaurantName}>{restaurantName}</Text>
                        {items.map((item) => (
                            <View key={item.menuItem.id} style={styles.orderItem}>
                                <Image
                                    source={{ uri: item.menuItem.image }}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.menuItem.name}</Text>
                                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                </View>
                                <Text style={styles.itemPrice}>
                                    {(item.menuItem.price * item.quantity).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Bill Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bill Details</Text>
                    {totalSavings > 0 && (
                        <View style={styles.savingsChip}>
                            <Text style={styles.savingsChipText}>You save Rs.{totalSavings.toFixed(2)} on this order</Text>
                        </View>
                    )}
                    <View style={styles.billCard}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Item Total</Text>
                            <Text style={styles.billValue}>{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Delivery Fee</Text>
                            <Text style={styles.billValue}>{deliveryFee.toFixed(2)}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.discountLabel}>Promo Applied</Text>
                            <Text style={styles.discountValue}>-{discount.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.billRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>{total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Delivery Timing */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Timing</Text>
                    <View style={styles.timingRow}>
                        <TouchableOpacity
                            style={[styles.timingChip, fulfillmentType === 'asap' && styles.timingChipActive]}
                            onPress={() => {
                                setFulfillmentType('asap');
                                setSelectedSlot(null);
                            }}>
                            <Text style={[styles.timingChipText, fulfillmentType === 'asap' && styles.timingChipTextActive]}>ASAP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.timingChip, fulfillmentType === 'scheduled' && styles.timingChipActive]}
                            onPress={() => setFulfillmentType('scheduled')}>
                            <Text style={[styles.timingChipText, fulfillmentType === 'scheduled' && styles.timingChipTextActive]}>Schedule</Text>
                        </TouchableOpacity>
                    </View>
                    {fulfillmentType === 'scheduled' && (
                        <>
                            <View style={styles.scheduleDayRow}>
                                {dayOptions.map((day) => (
                                    <TouchableOpacity
                                        key={day.value}
                                        style={[styles.dayChip, selectedScheduleDate === day.value && styles.dayChipActive]}
                                        onPress={() => {
                                            setSelectedScheduleDate(day.value);
                                            setSelectedSlot(null);
                                        }}>
                                        <Text style={[styles.dayChipText, selectedScheduleDate === day.value && styles.dayChipTextActive]}>{day.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotRow}>
                                {(slotsQuery.data?.slots || []).filter((slot) => slot.isAvailable).map((slot) => (
                                    <TouchableOpacity
                                        key={slot.startAt}
                                        style={[
                                            styles.slotChip,
                                            selectedSlot?.startAt === slot.startAt && styles.slotChipActive,
                                        ]}
                                        onPress={() => setSelectedSlot({ startAt: slot.startAt, label: slot.label })}>
                                        <Text style={[styles.slotChipText, selectedSlot?.startAt === slot.startAt && styles.slotChipTextActive]}>
                                            {slot.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                {slotsQuery.isLoading && (
                                    <View style={styles.slotLoading}>
                                        <ActivityIndicator color="#00E5FF" />
                                    </View>
                                )}
                                {slotsQuery.isError && (
                                    <Text style={styles.slotError}>Unable to load slots</Text>
                                )}
                            </ScrollView>
                        </>
                    )}
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.paymentOption,
                                selectedPayment === method.id && styles.paymentOptionSelected,
                            ]}
                            onPress={() => setSelectedPayment(method.id)}>
                            <Text style={styles.paymentIcon}>{method.icon}</Text>
                            <View style={styles.paymentInfo}>
                                <Text style={styles.paymentName}>{method.name}</Text>
                                {method.description && (
                                    <Text style={styles.paymentDescription}>{method.description}</Text>
                                )}
                            </View>
                            <View
                                style={[
                                    styles.radioButton,
                                    selectedPayment === method.id && styles.radioButtonSelected,
                                ]}>
                                {selectedPayment === method.id && <View style={styles.radioDot} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Place Order Button */}
            <View style={styles.footer}>
                <View style={styles.secureText}>
                    <Text style={styles.lockIcon}></Text>
                    <Text style={styles.secureLabel}>SECURE CHECKOUT</Text>
                </View>
                <TouchableOpacity
                    style={[styles.placeOrderButton, isProcessing && styles.buttonDisabled]}
                    onPress={handlePlaceOrder}
                    disabled={isProcessing}
                    activeOpacity={0.8}>
                    <Text style={styles.placeOrderText}>
                        {isProcessing ? (processingStep || 'Processing...') : `PAY ${total.toFixed(2)}`}
                    </Text>
                    {!isProcessing && <Text style={styles.arrowIcon}></Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    savingsChip: {
        alignSelf: 'flex-start',
        marginBottom: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#00C85355',
        backgroundColor: '#00C85322',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    savingsChipText: {
        color: '#00C853',
        fontSize: 12,
        fontWeight: '700',
    },
    timingRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    timingChip: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        backgroundColor: '#111111',
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    timingChipActive: {
        borderColor: '#00E5FF',
        backgroundColor: '#00E5FF22',
    },
    timingChipText: {
        color: '#CFCFCF',
        fontSize: 12,
        fontWeight: '600',
    },
    timingChipTextActive: {
        color: '#00E5FF',
    },
    scheduleDayRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    dayChip: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        backgroundColor: '#111111',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    dayChipActive: {
        borderColor: '#00E5FF',
        backgroundColor: '#00E5FF22',
    },
    dayChipText: {
        color: '#D0D0D0',
        fontSize: 12,
        fontWeight: '600',
    },
    dayChipTextActive: {
        color: '#00E5FF',
    },
    slotRow: {
        gap: 8,
        paddingRight: 10,
    },
    slotChip: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        backgroundColor: '#121212',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    slotChipActive: {
        borderColor: '#00E5FF',
        backgroundColor: '#00E5FF22',
    },
    slotChipText: {
        color: '#D0D0D0',
        fontSize: 12,
        fontWeight: '600',
    },
    slotChipTextActive: {
        color: '#00E5FF',
    },
    slotLoading: {
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slotError: {
        color: '#FF6B6B',
        fontSize: 12,
    },
    changeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#00E5FF',
    },
    addressCard: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
    },
    addressIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    addressInfo: {
        flex: 1,
    },
    addressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 12,
        color: '#9E9E9E',
        lineHeight: 18,
    },
    orderCard: {
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
    },
    restaurantName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 2,
    },
    itemQuantity: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    billCard: {
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    billLabel: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    billValue: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    discountLabel: {
        fontSize: 14,
        color: '#00C853',
    },
    discountValue: {
        fontSize: 14,
        color: '#00C853',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
        marginBottom: 0,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    paymentOptionSelected: {
        borderColor: '#00E5FF',
    },
    paymentOptionDisabled: {
        opacity: 0.5,
    },
    paymentIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    paymentDescription: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    paymentBalance: {
        fontSize: 12,
        color: '#00E5FF',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#4A4A4A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#00E5FF',
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#00E5FF',
    },
    bottomSpacing: {
        height: 120,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1A1A1A',
        padding: 16,
        paddingBottom: 30,
    },
    secureText: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    lockIcon: {
        fontSize: 12,
        marginRight: 6,
    },
    secureLabel: {
        fontSize: 10,
        color: '#6B6B6B',
        letterSpacing: 1,
    },
    placeOrderButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    placeOrderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 8,
    },
    arrowIcon: {
        fontSize: 18,
        color: '#000000',
    },
});

export default CheckoutScreen;
