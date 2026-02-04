import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

const orderItems = [
    { id: '1', name: 'Truffle Beef Burger', quantity: 1, price: 18.50, extra: 'Extra Cheese', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100' },
    { id: '2', name: 'Sweet Potato Fries', quantity: 2, price: 12.00, extra: 'Large', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100' },
    { id: '3', name: 'Vanilla Bean Shake', quantity: 1, price: 8.00, extra: 'Whipped Cream', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=100' },
];

export const OrderCancelledScreen: React.FC<Props> = ({ navigation, route }) => {
    const orderId = route.params?.orderId || '#8821';
    const refundAmount = 42.50;

    const handleReorder = () => {
        // Navigate to restaurant detail or add items to cart
        navigation.goBack();
    };

    const handleContactSupport = () => {
        // Navigate to help screen
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Cancelled Status */}
                <View style={styles.statusContainer}>
                    <View style={styles.cancelledIcon}>
                        <Text style={styles.xIcon}>✕</Text>
                    </View>
                    <Text style={styles.cancelledTitle}>Order Cancelled</Text>
                    <Text style={styles.cancelledSubtitle}>
                        Cancelled today at 8:45 PM
                    </Text>
                </View>

                {/* Refund Card */}
                <View style={styles.refundCard}>
                    <View style={styles.refundHeader}>
                        <Text style={styles.checkIcon}>✓</Text>
                        <Text style={styles.refundLabel}>REFUND STATUS</Text>
                    </View>
                    <View style={styles.refundContent}>
                        <View style={styles.refundInfo}>
                            <Text style={styles.refundTitle}>Refund Processed</Text>
                            <Text style={styles.refundText}>
                                The total amount of ${refundAmount.toFixed(2)} has been credited back to your Apple Pay account.
                            </Text>
                        </View>
                        <View style={styles.walletIcon}>
                            <Text style={styles.walletEmoji}>💳</Text>
                        </View>
                    </View>
                </View>

                {/* Order Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Items</Text>
                    {orderItems.map((item) => (
                        <View key={item.id} style={styles.orderItem}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemExtra}>Qty: {item.quantity} • {item.extra}</Text>
                            </View>
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Bill Summary */}
                <View style={styles.section}>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Subtotal</Text>
                        <Text style={styles.billValue}>$38.50</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Delivery Fee</Text>
                        <Text style={styles.billValue}>$4.00</Text>
                    </View>
                    <View style={[styles.billRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Refunded</Text>
                        <Text style={styles.totalValue}>${refundAmount.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
                        <Text style={styles.reorderIcon}>🔄</Text>
                        <Text style={styles.reorderText}>REORDER NOW</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
                        <Text style={styles.supportText}>Contact Support</Text>
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    statusContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    cancelledIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFB30033',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    xIcon: {
        fontSize: 28,
        color: '#FFB300',
        fontWeight: 'bold',
    },
    cancelledTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFB300',
        marginBottom: 8,
    },
    cancelledSubtitle: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    refundCard: {
        marginHorizontal: 16,
        backgroundColor: '#0A2A1A',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#00C85333',
    },
    refundHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkIcon: {
        fontSize: 14,
        color: '#00C853',
        marginRight: 8,
    },
    refundLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#00C853',
        letterSpacing: 1,
    },
    refundContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    refundInfo: {
        flex: 1,
    },
    refundTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    refundText: {
        fontSize: 14,
        color: '#9E9E9E',
        lineHeight: 20,
    },
    walletIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#00C85333',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    walletEmoji: {
        fontSize: 24,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    itemImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    itemExtra: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
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
    totalRow: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00C853',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00C853',
    },
    actionsContainer: {
        paddingHorizontal: 16,
    },
    reorderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00E5FF',
        paddingVertical: 16,
        borderRadius: 30,
        marginBottom: 12,
    },
    reorderIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    reorderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    supportButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    supportText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default OrderCancelledScreen;
