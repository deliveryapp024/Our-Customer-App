import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { BackButton } from '../../../components/ui/BackButton';
import { ordersApi } from '../../../api';
import { SCREENS } from '../../../constants';

type Props = { navigation: NativeStackNavigationProp<any> };

export const QuickReorderScreen: React.FC<Props> = ({ navigation }) => {
    const ordersQuery = useQuery({
        queryKey: ['quickReorderOrders'],
        queryFn: async () => {
            const response = await ordersApi.getOrders();
            if (!response.success) throw new Error(response.error || 'Failed to load orders');
            return response.data || [];
        },
        staleTime: 30 * 1000,
    });

    const deliveredOrders = React.useMemo(
        () => (ordersQuery.data || []).filter((o: any) => o.status === 'delivered').slice(0, 20),
        [ordersQuery.data],
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Quick Reorder</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={ordersQuery.isRefetching}
                        onRefresh={() => ordersQuery.refetch()}
                        tintColor="#00E5FF"
                        colors={['#00E5FF']}
                    />
                }>
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Reorder from previous purchases</Text>
                    <Text style={styles.heroSubtitle}>Fast path to your most recent delivered orders.</Text>
                </View>

                {ordersQuery.isLoading && (
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color="#00E5FF" />
                    </View>
                )}

                {!ordersQuery.isLoading && deliveredOrders.length === 0 && (
                    <View style={styles.emptyWrap}>
                        <Text style={styles.emptyTitle}>No delivered orders yet</Text>
                        <Text style={styles.emptySub}>Place your first order and it will appear here.</Text>
                    </View>
                )}

                {deliveredOrders.map((order: any) => (
                    <View key={String(order?._id)} style={styles.orderCard}>
                        <View style={styles.orderInfo}>
                            <Text style={styles.restaurantName}>{String(order?.branch?.name || 'Restaurant')}</Text>
                            <Text style={styles.orderItems}>{Array.isArray(order?.items) ? `${order.items.length} items` : 'Items unavailable'}</Text>
                            <Text style={styles.orderDate}>
                                {order?.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                            </Text>
                        </View>
                        <View style={styles.orderAction}>
                            <Text style={styles.orderTotal}>Rs.{Number(order?.totalPrice || 0).toFixed(2)}</Text>
                            <TouchableOpacity
                                style={styles.reorderButton}
                                onPress={() => navigation.navigate(SCREENS.RESTAURANT_DETAIL, { restaurantId: String(order?.branch?._id || order?.branch || '') })}>
                                <Text style={styles.reorderText}>REORDER</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
    placeholder: { width: 40 },
    heroSection: { paddingVertical: 20, paddingHorizontal: 16 },
    heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
    heroSubtitle: { fontSize: 14, color: '#9E9E9E' },
    loadingWrap: { paddingVertical: 40, alignItems: 'center' },
    emptyWrap: { alignItems: 'center', paddingVertical: 42, paddingHorizontal: 16 },
    emptyTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    emptySub: { color: '#9E9E9E', marginTop: 6, textAlign: 'center' },
    orderCard: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, marginBottom: 12 },
    orderInfo: { flex: 1 },
    restaurantName: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
    orderItems: { fontSize: 14, color: '#9E9E9E', marginBottom: 4 },
    orderDate: { fontSize: 12, color: '#6B6B6B' },
    orderAction: { alignItems: 'flex-end' },
    orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
    reorderButton: { backgroundColor: '#00E5FF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    reorderText: { fontSize: 12, fontWeight: 'bold', color: '#000000' },
});

export default QuickReorderScreen;

