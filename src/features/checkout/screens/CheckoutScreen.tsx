import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SCREENS } from '../../../constants';
import { useCartStore } from '../../../store/cartStore';
import { ordersApi, Order } from '../../../api';
import { BackButton } from '../../../components/ui/BackButton';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive' },
    { id: 'wallet', name: 'App Wallet', icon: '💼', balance: '₹24.50', disabled: true },
    { id: 'gpay', name: 'Google Pay', icon: '🔵', description: 'UPI (Coming Soon)', disabled: true },
    { id: 'card', name: '•••• 4242', icon: '💳', description: 'Visa (Coming Soon)', disabled: true },
];

export const CheckoutScreen: React.FC<Props> = ({ navigation, route }) => {
    const { items, restaurantName, getTotal, getItemCount, clearCart } = useCartStore();
    const [selectedPayment, setSelectedPayment] = useState('cod'); // COD for Phase 0
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);

    // Get branch info from navigation params (preferred) or cart fallback
    const branchId = route.params?.branchId || useCartStore.getState().restaurantId;
    const deliveryLocation = route.params?.deliveryLocation;

    const subtotal = getTotal();
    const deliveryFee = 2.99;
    const discount = 5.00;
    const total = subtotal + deliveryFee - discount;

    // Generate idempotency key for this checkout session
    const [idempotencyKey] = useState(() => `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    const handlePlaceOrder = async () => {
        if (!branchId) {
            Alert.alert('Error', 'Restaurant branchId is missing. Please re-open restaurant and try again.');
            return;
        }

        if (items.length === 0) {
            Alert.alert('Error', 'Your cart is empty');
            return;
        }

        // Strict payload guard: every line must carry a real product id.
        const invalidItem = items.find((item) => !item?.menuItem?.id || String(item.menuItem.id).trim().length === 0);
        if (invalidItem) {
            Alert.alert('Error', 'One or more cart items have invalid product IDs. Please remove and add again.');
            return;
        }

        setIsProcessing(true);
        setOrderError(null);

        // Prepare order items
        // Server expects: item = product ID (ObjectId), count = quantity, name = display name
        const orderItems = items.map(item => ({
            item: String(item.menuItem.id),  // Product ID (ObjectId) - REQUIRED by server
            count: item.quantity,
            name: item.menuItem.name,  // Display name (optional, for reference)
        }));

        if (__DEV__) {
            console.log('[Checkout] createOrder payload', {
                branchId: String(branchId),
                itemCount: orderItems.length,
                firstProductId: orderItems[0]?.item,
            });
        }

        // Create order with idempotency key (prevents duplicates on retry)
        const result = await ordersApi.createOrder({
            items: orderItems,
            branch: String(branchId),
            totalPrice: total,
            deliveryLocation,
            idempotencyKey, // Same key on retry = same order result
        });

        setIsProcessing(false);

        if (result.success) {
            const order = result.data;
            clearCart();
            navigation.navigate(SCREENS.ORDER_SUCCESS, {
                orderId: order._id,
                total: total.toFixed(2),
                restaurantName,
            });
        } else {
            setOrderError(result.error || 'Failed to place order');
            Alert.alert('Order Failed', result.error || 'Failed to place order. Please try again.');
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
                        <Text style={styles.addressIcon}>🏠</Text>
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
                                    ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Bill Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bill Details</Text>
                    <View style={styles.billCard}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Item Total</Text>
                            <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Delivery Fee</Text>
                            <Text style={styles.billValue}>₹{deliveryFee.toFixed(2)}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.discountLabel}>Promo Applied</Text>
                            <Text style={styles.discountValue}>-₹{discount.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.billRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
                        </View>
                    </View>
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
                                method.disabled && styles.paymentOptionDisabled,
                            ]}
                            onPress={() => !method.disabled && setSelectedPayment(method.id)}
                            disabled={method.disabled}>
                            <Text style={styles.paymentIcon}>{method.icon}</Text>
                            <View style={styles.paymentInfo}>
                                <Text style={styles.paymentName}>{method.name}</Text>
                                {method.description && (
                                    <Text style={styles.paymentDescription}>{method.description}</Text>
                                )}
                                {method.balance && (
                                    <Text style={styles.paymentBalance}>Balance: {method.balance}</Text>
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
                    <Text style={styles.lockIcon}>🔒</Text>
                    <Text style={styles.secureLabel}>SECURE CHECKOUT</Text>
                </View>
                <TouchableOpacity
                    style={[styles.placeOrderButton, isProcessing && styles.buttonDisabled]}
                    onPress={handlePlaceOrder}
                    disabled={isProcessing}
                    activeOpacity={0.8}>
                    <Text style={styles.placeOrderText}>
                        {isProcessing ? 'Processing...' : `PAY ₹${total.toFixed(2)}`}
                    </Text>
                    {!isProcessing && <Text style={styles.arrowIcon}>→</Text>}
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
