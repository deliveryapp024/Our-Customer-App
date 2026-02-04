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
import { SCREENS } from '../../../constants';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface Order {
    id: string;
    orderNumber: string;
    restaurantName: string;
    restaurantImage: string;
    items: string;
    total: string;
    date: string;
    status: 'delivered' | 'cancelled' | 'in_progress';
}

const pastOrders: Order[] = [
    {
        id: '1',
        orderNumber: '#8821',
        restaurantName: 'The Gourmet Kitchen',
        restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100',
        items: 'Truffle Burger, Fries, Shake',
        total: '$42.50',
        date: 'Today, 8:30 PM',
        status: 'delivered',
    },
    {
        id: '2',
        orderNumber: '#8819',
        restaurantName: 'Urban Bites',
        restaurantImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100',
        items: 'Chicken Wings x2, Coke',
        total: '$28.00',
        date: 'Yesterday, 1:15 PM',
        status: 'delivered',
    },
    {
        id: '3',
        orderNumber: '#8815',
        restaurantName: 'Spice Garden',
        restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100',
        items: 'Butter Chicken, Naan x2',
        total: '$35.00',
        date: '2 days ago',
        status: 'cancelled',
    },
];

export const OrderHistoryScreen: React.FC<Props> = ({ navigation }) => {
    const handleOrderPress = (order: Order) => {
        if (order.status === 'cancelled') {
            navigation.navigate(SCREENS.ORDER_CANCELLED, { orderId: order.orderNumber });
        } else {
            navigation.navigate(SCREENS.TRACKING, { orderId: order.orderNumber });
        }
    };

    const handleReorder = (order: Order) => {
        // Add items to cart and navigate to restaurant
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'delivered':
                return '#00C853';
            case 'cancelled':
                return '#FF5252';
            case 'in_progress':
                return '#00E5FF';
            default:
                return '#9E9E9E';
        }
    };

    const getStatusText = (status: Order['status']) => {
        switch (status) {
            case 'delivered':
                return 'Delivered';
            case 'cancelled':
                return 'Cancelled';
            case 'in_progress':
                return 'In Progress';
            default:
                return status;
        }
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
                <Text style={styles.headerTitle}>Order History</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Filter Tabs */}
                <View style={styles.filterTabs}>
                    <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
                        <Text style={styles.filterTabTextActive}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterTab}>
                        <Text style={styles.filterTabText}>Delivered</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterTab}>
                        <Text style={styles.filterTabText}>Cancelled</Text>
                    </TouchableOpacity>
                </View>

                {/* Orders */}
                {pastOrders.map((order) => (
                    <TouchableOpacity
                        key={order.id}
                        style={styles.orderCard}
                        onPress={() => handleOrderPress(order)}>
                        <View style={styles.orderHeader}>
                            <Image
                                source={{ uri: order.restaurantImage }}
                                style={styles.restaurantImage}
                            />
                            <View style={styles.orderInfo}>
                                <Text style={styles.restaurantName}>{order.restaurantName}</Text>
                                <Text style={styles.orderItems}>{order.items}</Text>
                                <Text style={styles.orderDate}>{order.date}</Text>
                            </View>
                            <View style={styles.orderRight}>
                                <Text style={styles.orderTotal}>{order.total}</Text>
                                <Text
                                    style={[
                                        styles.orderStatus,
                                        { color: getStatusColor(order.status) },
                                    ]}>
                                    {getStatusText(order.status)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.orderActions}>
                            <TouchableOpacity
                                style={styles.reorderButton}
                                onPress={() => handleReorder(order)}>
                                <Text style={styles.reorderIcon}>🔄</Text>
                                <Text style={styles.reorderText}>Reorder</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.detailsButton}>
                                <Text style={styles.detailsText}>View Details</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

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
    filterTabs: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
        gap: 8,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
    },
    filterTabActive: {
        backgroundColor: '#00E5FF',
    },
    filterTabText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    filterTabTextActive: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    orderCard: {
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        marginBottom: 12,
    },
    orderHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    restaurantImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
        marginRight: 12,
    },
    orderInfo: {
        flex: 1,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    orderItems: {
        fontSize: 13,
        color: '#9E9E9E',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 12,
        color: '#6B6B6B',
    },
    orderRight: {
        alignItems: 'flex-end',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    orderStatus: {
        fontSize: 12,
        fontWeight: '500',
    },
    orderActions: {
        flexDirection: 'row',
        gap: 12,
    },
    reorderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00E5FF',
        paddingVertical: 12,
        borderRadius: 25,
    },
    reorderIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    reorderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    detailsButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2A2A2A',
        paddingVertical: 12,
        borderRadius: 25,
    },
    detailsText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default OrderHistoryScreen;
