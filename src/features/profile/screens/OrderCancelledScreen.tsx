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
import { BackButton } from '../../../components/ui/BackButton';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

// Images from order_cancelled_&_refund_status design
const orderItems = [
    { id: '1', name: 'Truffle Beef Burger', quantity: 1, price: 18.50, extra: 'Extra Cheese', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbB3p9WC8pJ29Ovwzd5NzoTKRER_poni61dpDg8aluZRq8TUYT1PYGfPxmjMavgelkXZyB7H1O3JraNBwj43WwCCpMXC43H5OvYJC9vF78ilQ3OLqI-Eh3BeowMBVnbSfU4CWp2dGd5TvQuRBaWmI76vEdpEVlGbtcvDyYrhYrYywM_s7LnC_stWQbTFjjKub3QGrvmPMra7BjtYA_xgktZNzB86Ucj4PXRJvIHjJbggc4lc7O8Awa4pn7HPxfqgrPkTnjh0nX-swF' },
    { id: '2', name: 'Sweet Potato Fries', quantity: 2, price: 12.00, extra: 'Large', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAARt6_bYmyFPpR5G4WCZ8KknwqIDH8Pb6-hRow4BXF7W6ZfMhPn34pmmUpQmYFDE0SIJJ7h90GEeXrV2u4SSb8SJqBCZiWyWCfN7Yif23kxy8pd2TCu_t_WSW5FVugWlDFaWP8MuLzn42y_E5k9T7u8di0GTsmnUolhSIlrvENUz3vUxwBQ0K1iLCopKb9uk4G5Su3IfsKJsLzG73_NxZX4IlnwInL8gFYr6n6_gGhscy8myngILyJyJBBDkMXSQFT6YtuP2VyL20P' },
    { id: '3', name: 'Vanilla Bean Shake', quantity: 1, price: 8.00, extra: 'Whipped Cream', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgsqsJBwp1811VYDbrKEAqIJ-86IHmTJIkDeY-nJ3nQOu-5xkxniSw1i41WQbIEoj0ptYdsRR9kax80xi3aG1iR0imeStXXwUf2OBmRAfqqIuWfFLZy2_5MNsRpzH9p5K6jE5bjA0hw1_DknO7acOerXVZUHElIeMaj6RvhCq7qCBwEQDz8T6ArgyE9c3iiGwuvj73I5aeajgG97mHI-1RHOWvDHkVw3A4jLs_C8Lr0SaYv43uYXmtHbkYmGCTn-YzKbfOtjfd761G' },
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
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Cancelled Status */}
                <View style={styles.statusContainer}>
                    <View style={styles.cancelledIcon}>
                        <Text style={styles.xIcon}></Text>
                    </View>
                    <Text style={styles.cancelledTitle}>Order Cancelled</Text>
                    <Text style={styles.cancelledSubtitle}>
                        Cancelled today at 8:45 PM
                    </Text>
                </View>

                {/* Refund Card */}
                <View style={styles.refundCard}>
                    <View style={styles.refundHeader}>
                        <Text style={styles.checkIcon}></Text>
                        <Text style={styles.refundLabel}>REFUND STATUS</Text>
                    </View>
                    <View style={styles.refundContent}>
                        <View style={styles.refundInfo}>
                            <Text style={styles.refundTitle}>Refund Processed</Text>
                            <Text style={styles.refundText}>
                                The total amount of {refundAmount.toFixed(2)} has been credited back to your Apple Pay account.
                            </Text>
                        </View>
                        <View style={styles.walletIcon}>
                            <Text style={styles.walletEmoji}>Card</Text>
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
                                <Text style={styles.itemExtra}>Qty: {item.quantity}  {item.extra}</Text>
                            </View>
                            <Text style={styles.itemPrice}>{item.price.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Bill Summary */}
                <View style={styles.section}>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Subtotal</Text>
                        <Text style={styles.billValue}>38.50</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Delivery Fee</Text>
                        <Text style={styles.billValue}>4.00</Text>
                    </View>
                    <View style={[styles.billRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Refunded</Text>
                        <Text style={styles.totalValue}>{refundAmount.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
                        <Text style={styles.reorderIcon}>Reorder</Text>
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
