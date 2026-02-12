import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    StyleSheet,
    Share,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BackButton } from '../../../components/ui/BackButton';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

const orderItems = [
    { id: '1', name: 'Truffle Beef Burger', quantity: 1, price: 18.50, customization: 'Extra Cheese' },
    { id: '2', name: 'Sweet Potato Fries', quantity: 2, price: 12.00, customization: 'Large' },
    { id: '3', name: 'Vanilla Bean Shake', quantity: 1, price: 8.00, customization: 'Whipped Cream' },
];

export const OrderReceiptScreen: React.FC<Props> = ({ navigation, route }) => {
    const orderId = route.params?.orderId || '#8821';
    const orderDate = 'Feb 4, 2026, 8:30 PM';

    const subtotal = 38.50;
    const deliveryFee = 2.99;
    const taxes = 3.08;
    const discount = 5.00;
    const total = subtotal + deliveryFee + taxes - discount;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Order Receipt ${orderId} - Total: ₹${total.toFixed(2)}`,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const handleDownload = () => {
        // Download PDF receipt
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Order Receipt</Text>
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Text style={styles.shareIcon}>📤</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Receipt Card */}
                <View style={styles.receiptCard}>
                    {/* Header */}
                    <View style={styles.receiptHeader}>
                        <Text style={styles.receiptTitle}>The Gourmet Kitchen</Text>
                        <Text style={styles.orderId}>Order {orderId}</Text>
                        <Text style={styles.orderDate}>{orderDate}</Text>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <View style={styles.dividerCircleLeft} />
                        <View style={styles.dividerCircleRight} />
                    </View>

                    {/* Items */}
                    <View style={styles.itemsSection}>
                        <Text style={styles.sectionLabel}>ORDER ITEMS</Text>
                        {orderItems.map((item) => (
                            <View key={item.id} style={styles.itemRow}>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemCustomization}>{item.customization}</Text>
                                </View>
                                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Divider */}
                    <View style={styles.dashedDivider} />

                    {/* Bill Summary */}
                    <View style={styles.billSection}>
                        <Text style={styles.sectionLabel}>BILL SUMMARY</Text>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Item Total</Text>
                            <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Delivery Fee</Text>
                            <Text style={styles.billValue}>₹{deliveryFee.toFixed(2)}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Taxes & Charges</Text>
                            <Text style={styles.billValue}>₹{taxes.toFixed(2)}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.discountLabel}>Promo Discount</Text>
                            <Text style={styles.discountValue}>-₹{discount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Paid</Text>
                            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Payment Info */}
                    <View style={styles.paymentSection}>
                        <Text style={styles.sectionLabel}>PAYMENT</Text>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentIcon}>💳</Text>
                            <Text style={styles.paymentText}>Visa •••• 4242</Text>
                            <Text style={styles.paidBadge}>PAID</Text>
                        </View>
                    </View>

                    {/* Delivery Info */}
                    <View style={styles.deliverySection}>
                        <Text style={styles.sectionLabel}>DELIVERED TO</Text>
                        <View style={styles.addressRow}>
                            <Text style={styles.addressIcon}>📍</Text>
                            <Text style={styles.addressText}>
                                45-2/A Main Street, Camp Area, Belagavi
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                        <Text style={styles.downloadIcon}>📥</Text>
                        <Text style={styles.downloadText}>Download PDF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reorderButton}>
                        <Text style={styles.reorderText}>🔄 Reorder</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
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
    shareButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareIcon: {
        fontSize: 18,
    },
    receiptCard: {
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
    },
    receiptHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    receiptTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 14,
        color: '#6B6B6B',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    divider: {
        position: 'relative',
        height: 20,
        marginBottom: 16,
    },
    dividerLine: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    dividerCircleLeft: {
        position: 'absolute',
        left: -32,
        top: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#000000',
    },
    dividerCircleRight: {
        position: 'absolute',
        right: -32,
        top: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#000000',
    },
    itemsSection: {
        marginBottom: 16,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#9E9E9E',
        letterSpacing: 1,
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 2,
    },
    itemCustomization: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#6B6B6B',
        marginRight: 16,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    dashedDivider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 16,
    },
    billSection: {
        marginBottom: 16,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    billLabel: {
        fontSize: 14,
        color: '#6B6B6B',
    },
    billValue: {
        fontSize: 14,
        color: '#000000',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    paymentSection: {
        marginBottom: 16,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    paymentText: {
        flex: 1,
        fontSize: 14,
        color: '#000000',
    },
    paidBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#00C853',
        backgroundColor: '#00C85333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    deliverySection: {},
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    addressIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        color: '#6B6B6B',
        lineHeight: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 24,
        gap: 12,
    },
    downloadButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        paddingVertical: 14,
        borderRadius: 25,
    },
    downloadIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    downloadText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    reorderButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00E5FF',
        paddingVertical: 14,
        borderRadius: 25,
    },
    reorderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default OrderReceiptScreen;
