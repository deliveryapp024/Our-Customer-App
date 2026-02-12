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
    RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS } from '../../../constants';
import { BackButton } from '../../../components/ui/BackButton';
import { ordersApi, Order as ApiOrder } from '../../../api';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface DisplayOrder {
    id: string;
    orderNumber: string;
    restaurantName: string;
    restaurantImage: string;
    items: string;
    total: string;
    date: string;
    status: 'delivered' | 'cancelled' | 'in_progress';
}

export const OrderHistoryScreen: React.FC<Props> = ({ navigation }) => {
    const [orders, setOrders] = useState<DisplayOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch orders from API
    const fetchOrders = async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        setError(null);

        const result = await ordersApi.getOrders();
        
        if (result.success) {
            // Transform API orders to display format
            const apiOrders = result.data.map((order: ApiOrder) => ({
                id: order._id,
                orderNumber: `#${order._id.slice(-4)}`,
                restaurantName: 'Restaurant', // TODO: Get from seller data
                restaurantImage: '', // TODO: Get from seller data
                items: `${order.items.length} items`,
                total: `₹${order.totalPrice.toFixed(2)}`,
                date: new Date(order.createdAt).toLocaleDateString(),
                status: mapOrderStatus(order.status),
            }));
            setOrders(apiOrders);
        } else {
            setError(result.error || 'Failed to load orders');
            setOrders([]); // Empty state on error
        }

        setLoading(false);
        setRefreshing(false);
    };

    // Map API status to display status
    const mapOrderStatus = (status: string): DisplayOrder['status'] => {
        switch (status) {
            case 'delivered':
                return 'delivered';
            case 'cancelled':
                return 'cancelled';
            case 'confirmed':
            case 'arriving':
                return 'in_progress';
            default:
                return 'in_progress';
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders(true);
    };

    const handleOrderPress = (order: DisplayOrder) => {
        if (order.status === 'cancelled') {
            navigation.navigate(SCREENS.ORDER_CANCELLED, { orderId: order.orderNumber });
        } else {
            navigation.navigate(SCREENS.TRACKING, { orderId: order.orderNumber });
        }
    };

    const handleReorder = (order: DisplayOrder) => {
        // Add items to cart and navigate to restaurant
    };

    const getStatusColor = (status: DisplayOrder['status']) => {
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

    const getStatusText = (status: DisplayOrder['status']) => {
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
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Order History</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#00E5FF"
                    />
                }>
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

                {/* Loading State */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#00E5FF" />
                    </View>
                )}

                {/* Error State */}
                {error && __DEV__ && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Debug: {error}</Text>
                    </View>
                )}

                {/* Empty State */}
                {!loading && orders.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📦</Text>
                        <Text style={styles.emptyTitle}>No Orders Yet</Text>
                        <Text style={styles.emptyText}>
                            You haven't placed any orders yet.{'\n'}
                            Start exploring restaurants!
                        </Text>
                        <TouchableOpacity 
                            style={styles.browseButton}
                            onPress={() => navigation.navigate(SCREENS.HOME)}>
                            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Orders */}
                {orders.map((order) => (
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
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    errorContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    errorText: {
        fontSize: 12,
        color: '#FF5252',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#9E9E9E',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    browseButton: {
        backgroundColor: '#00E5FF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    browseButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
});

export default OrderHistoryScreen;
