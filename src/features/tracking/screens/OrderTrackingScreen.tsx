import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SCREENS } from '../../../constants';
import { ordersApi, Order } from '../../../api';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

interface TrackingStep {
    id: string;
    title: string;
    subtitle: string;
    time?: string;
    isCompleted: boolean;
    isActive: boolean;
}

const getInitialSteps = (): TrackingStep[] => [
    { id: '1', title: 'Order Placed', subtitle: 'Your order has been received', time: '', isCompleted: false, isActive: true },
    { id: '2', title: 'Order Confirmed', subtitle: 'Restaurant accepted your order', time: '', isCompleted: false, isActive: false },
    { id: '3', title: 'Being Prepared', subtitle: 'Chef is cooking your food', time: '', isCompleted: false, isActive: false },
    { id: '4', title: 'Out for Delivery', subtitle: 'Driver is on the way', time: '', isCompleted: false, isActive: false },
    { id: '5', title: 'Delivered', subtitle: 'Enjoy your meal!', time: '', isCompleted: false, isActive: false },
];

export const OrderTrackingScreen: React.FC<Props> = ({ navigation, route }) => {
    const orderId = route.params?.orderId;
    const [steps, setSteps] = useState<TrackingStep[]>(getInitialSteps());
    const [eta, setEta] = useState(8);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Polling configuration
    const POLLING_CONFIG = {
        initialInterval: 5000,    // 5 seconds
        maxInterval: 30000,       // 30 seconds max
        backoffMultiplier: 1.5,   // Increase by 50% each time
        terminalStates: ['delivered', 'cancelled', 'seller_rejected'],
    };

    // Fetch order details
    const fetchOrderDetails = async (isBackgroundPoll = false) => {
        if (!orderId) return;
        
        // Extract order ID from orderNumber format (#XXXX)
        const id = orderId.startsWith('#') ? orderId.slice(1) : orderId;
        
        if (!isBackgroundPoll) {
            setLoading(true);
        }
        setError(null);
        
        const result = await ordersApi.getOrderById(id);
        
        if (result.success) {
            setOrder(result.data);
            updateTrackingSteps(result.data.status);
            setLastUpdated(new Date());
        } else {
            setError(result.error || 'Failed to load order');
            if (!isBackgroundPoll) {
                setOrder(null);
            }
        }
        
        if (!isBackgroundPoll) {
            setLoading(false);
        }
        
        return result.success ? result.data : null;
    };

    // Initial fetch
    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    // Polling with backoff
    useEffect(() => {
        if (!orderId || !order) return;

        let pollInterval = POLLING_CONFIG.initialInterval;
        let pollTimer: NodeJS.Timeout | null = null;
        let isActive = true;

        const poll = async () => {
            if (!isActive) return;

            // Stop polling if order reached terminal state
            if (order && POLLING_CONFIG.terminalStates.includes(order.status)) {
                console.log('[OrderTracking] Polling stopped - terminal state:', order.status);
                setIsPolling(false);
                return;
            }

            setIsPolling(true);
            const updatedOrder = await fetchOrderDetails(true);

            if (updatedOrder && isActive) {
                // Check if status changed
                if (updatedOrder.status !== order.status) {
                    console.log('[OrderTracking] Status changed:', order.status, '->', updatedOrder.status);
                    // Reset interval on status change for quicker updates
                    pollInterval = POLLING_CONFIG.initialInterval;
                } else {
                    // Increase interval with backoff (capped at max)
                    pollInterval = Math.min(
                        pollInterval * POLLING_CONFIG.backoffMultiplier,
                        POLLING_CONFIG.maxInterval
                    );
                }

                // Schedule next poll
                pollTimer = setTimeout(poll, pollInterval);
            }
        };

        // Start polling after initial delay
        pollTimer = setTimeout(poll, POLLING_CONFIG.initialInterval);

        return () => {
            isActive = false;
            if (pollTimer) {
                clearTimeout(pollTimer);
            }
        };
    }, [orderId, order?.status]);

    // Handle app background/foreground (simplified - full implementation needs AppState)
    useEffect(() => {
        // In a real app, you'd use AppState to pause/resume polling
        // when app goes to background/foreground
        console.log('[OrderTracking] Polling active:', isPolling);
    }, [isPolling]);

    // Update tracking steps based on order status
    const updateTrackingSteps = (status: string) => {
        const updatedSteps = initialSteps.map((step, index) => {
            const stepStatus = getStepStatus(step.title);
            const statusOrder = ['pending_seller_approval', 'available', 'confirmed', 'arriving', 'delivered'];
            const currentIndex = statusOrder.indexOf(status);
            const stepIndex = statusOrder.indexOf(stepStatus);

            return {
                ...step,
                isCompleted: stepIndex <= currentIndex && stepIndex !== -1,
                isActive: stepStatus === status,
            };
        });
        setSteps(updatedSteps);
    };

    // Map step title to API status
    const getStepStatus = (title: string): string => {
        switch (title) {
            case 'Order Placed':
                return 'pending_seller_approval';
            case 'Order Confirmed':
                return 'confirmed';
            case 'Being Prepared':
                return 'confirmed';
            case 'Out for Delivery':
                return 'arriving';
            case 'Delivered':
                return 'delivered';
            default:
                return '';
        }
    };

    useEffect(() => {
        // Simulate countdown
        const interval = setInterval(() => {
            setEta((prev) => (prev > 0 ? prev - 1 : 0));
        }, 60000); // Every minute
        return () => clearInterval(interval);
    }, []);

    const handleRateOrder = () => {
        navigation.navigate(SCREENS.RATE_REVIEW, { orderId });
    };

    // Show loading state
    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <ActivityIndicator size="large" color="#00E5FF" />
                <Text style={styles.loadingText}>Loading order details...</Text>
            </View>
        );
    }

    // Show error/empty state if no order
    if (!order && !loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitle}>Order Not Found</Text>
                <Text style={styles.emptyText}>
                    {error || 'We couldn\'t find this order.\nIt may have been removed or expired.'}
                </Text>
                <TouchableOpacity 
                    style={styles.backToOrdersButton}
                    onPress={() => navigation.navigate(SCREENS.ORDER_HISTORY)}>
                    <Text style={styles.backToOrdersText}>View Order History</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
                <Text style={styles.headerTitle}>Order {orderId}</Text>
                <TouchableOpacity style={styles.sosButton}>
                    <Text style={styles.sosText}>SOS</Text>
                </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && __DEV__ && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>Debug: {error}</Text>
                </View>
            )}

            {/* Polling Status Indicator */}
            <View style={styles.pollingContainer}>
                {isPolling && (
                    <View style={styles.pollingIndicator}>
                        <View style={styles.pollingDot} />
                        <Text style={styles.pollingText}>Live updates</Text>
                    </View>
                )}
                {lastUpdated && (
                    <Text style={styles.lastUpdatedText}>
                        Updated {lastUpdated.toLocaleTimeString()}
                    </Text>
                )}
            </View>

            {/* Map Placeholder */}
            <View style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                    <Text style={styles.mapIcon}>🗺️</Text>
                    <View style={styles.routeLine} />
                    <View style={styles.destinationMarker}>
                        <Text style={styles.markerIcon}>📍</Text>
                    </View>
                    <View style={styles.driverMarker}>
                        <Text style={styles.driverIcon}>🛵</Text>
                    </View>
                </View>
            </View>

            {/* Driver Info Card */}
            <View style={styles.driverCard}>
                <View style={styles.etaContainer}>
                    <Text style={styles.etaText}>Arriving in</Text>
                    <Text style={styles.etaTime}>{eta} mins</Text>
                </View>
                <View style={styles.driverInfo}>
                    {/* Image from dynamic_order_tracking_pill design */}
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFX_4DnXQMnnltePyfaUUjKeTVXIt2zFmQd6CIaFC9K7IASOpdhVjUxWji2J3yoiOoBdDRwjZ4sQHfb9qsD0cF4rpblF_roN5TRmZd00fspPeR8V62KGXBE8I_9Ni8U3LTsIOer2TbrP87iFnwvszD2wp-IQ3aydROFwwoOKLpGJwe4MrTGCaViJDfwu4a8lAbQetdjAuJYywtx12QgEaFfj1OXPXok7Up4Lq7bUELuvO7jcqnxk4l4XTp4f4k5ujT5xS7vZKrHlFw' }}
                        style={styles.driverImage}
                    />
                    <View style={styles.driverDetails}>
                        <Text style={styles.driverName}>Rahul Kumar</Text>
                        <Text style={styles.vehicleInfo}>DL 4C 1234 • Honda Activa</Text>
                    </View>
                    <View style={styles.driverActions}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>💬</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>📞</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Order Timeline */}
                <View style={styles.timelineContainer}>
                    {steps.map((step, index) => (
                        <View key={step.id} style={styles.timelineItem}>
                            <View style={styles.timelineLeft}>
                                <View
                                    style={[
                                        styles.timelineDot,
                                        step.isCompleted && styles.timelineDotCompleted,
                                        step.isActive && styles.timelineDotActive,
                                    ]}>
                                    {step.isCompleted && <Text style={styles.checkIcon}>✓</Text>}
                                    {step.isActive && <View style={styles.activePulse} />}
                                </View>
                                {index < steps.length - 1 && (
                                    <View
                                        style={[
                                            styles.timelineLine,
                                            step.isCompleted && styles.timelineLineCompleted,
                                        ]}
                                    />
                                )}
                            </View>
                            <View style={styles.timelineContent}>
                                <Text
                                    style={[
                                        styles.stepTitle,
                                        step.isCompleted && styles.stepTitleCompleted,
                                        step.isActive && styles.stepTitleActive,
                                    ]}>
                                    {step.title}
                                </Text>
                                <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                                {step.time && <Text style={styles.stepTime}>{step.time}</Text>}
                            </View>
                        </View>
                    ))}
                </View>

                {/* View Order Details */}
                <TouchableOpacity style={styles.viewDetailsButton}>
                    <Text style={styles.viewDetailsText}>View Order Details</Text>
                    <Text style={styles.viewDetailsArrow}>→</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#9E9E9E',
    },
    errorBanner: {
        backgroundColor: '#FF525220',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    errorText: {
        fontSize: 12,
        color: '#FF5252',
    },
    pollingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#1A1A1A',
    },
    pollingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pollingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00C853',
        marginRight: 6,
    },
    pollingText: {
        fontSize: 12,
        color: '#00C853',
    },
    lastUpdatedText: {
        fontSize: 11,
        color: '#6B6B6B',
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
        paddingHorizontal: 32,
        lineHeight: 20,
    },
    backToOrdersButton: {
        backgroundColor: '#00E5FF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    backToOrdersText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
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
    sosButton: {
        backgroundColor: '#FF5252',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    sosText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    mapContainer: {
        height: 200,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    mapPlaceholder: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    mapIcon: {
        fontSize: 60,
        opacity: 0.5,
    },
    routeLine: {
        position: 'absolute',
        width: 100,
        height: 3,
        backgroundColor: '#00E5FF',
        top: '50%',
    },
    destinationMarker: {
        position: 'absolute',
        right: 40,
        top: '40%',
    },
    markerIcon: {
        fontSize: 24,
    },
    driverMarker: {
        position: 'absolute',
        left: 60,
        top: '45%',
        backgroundColor: '#00E5FF',
        padding: 8,
        borderRadius: 20,
    },
    driverIcon: {
        fontSize: 20,
    },
    driverCard: {
        marginHorizontal: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    etaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    etaText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    etaTime: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00E5FF',
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    driverDetails: {
        flex: 1,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    vehicleInfo: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    driverActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 18,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    timelineContainer: {
        marginTop: 8,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    timelineLeft: {
        alignItems: 'center',
        width: 32,
    },
    timelineDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4A4A4A',
    },
    timelineDotCompleted: {
        backgroundColor: '#00C853',
        borderColor: '#00C853',
    },
    timelineDotActive: {
        backgroundColor: '#00E5FF',
        borderColor: '#00E5FF',
    },
    checkIcon: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    activePulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#000000',
    },
    timelineLine: {
        width: 2,
        height: 50,
        backgroundColor: '#2A2A2A',
    },
    timelineLineCompleted: {
        backgroundColor: '#00C853',
    },
    timelineContent: {
        flex: 1,
        paddingLeft: 12,
        paddingBottom: 24,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B6B6B',
        marginBottom: 4,
    },
    stepTitleCompleted: {
        color: '#FFFFFF',
    },
    stepTitleActive: {
        color: '#00E5FF',
    },
    stepSubtitle: {
        fontSize: 14,
        color: '#6B6B6B',
        marginBottom: 4,
    },
    stepTime: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 40,
    },
    viewDetailsText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    viewDetailsArrow: {
        fontSize: 16,
        color: '#9E9E9E',
    },
});

export default OrderTrackingScreen;
