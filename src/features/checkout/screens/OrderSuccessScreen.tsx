import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SCREENS } from '../../../constants';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

export const OrderSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
    const orderId = route.params?.orderId || 'ORD12345';
    const total = route.params?.total || '42.50';
    const restaurantName = route.params?.restaurantName || 'The Gourmet Kitchen';

    const handleTrackOrder = () => {
        navigation.navigate(SCREENS.TRACKING, { orderId });
    };

    const handleGoHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: SCREENS.HOME_TAB }],
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={handleGoHome}>
                <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>

            {/* Success Animation Placeholder */}
            <View style={styles.successContainer}>
                <View style={styles.successCircle}>
                    <View style={styles.successInner}>
                        <Text style={styles.checkIcon}>✓</Text>
                    </View>
                </View>
            </View>

            {/* Success Message */}
            <Text style={styles.title}>Order Confirmed!</Text>
            <Text style={styles.subtitle}>
                Your gourmet selection will arrive at your doorstep in{' '}
                <Text style={styles.highlight}>25-35 minutes</Text>.
            </Text>

            {/* Order Card */}
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <Text style={styles.arrivalLabel}>ARRIVING AT 8:15 PM</Text>
                </View>
                <View style={styles.orderContent}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.restaurantName}>{restaurantName}</Text>
                        <Text style={styles.orderDetails}>
                            Order #{orderId} • ${total}
                        </Text>
                        <View style={styles.addressRow}>
                            <Text style={styles.locationIcon}>📍</Text>
                            <Text style={styles.addressText}>Home, Camp Area</Text>
                        </View>
                    </View>
                    <View style={styles.foodImageContainer}>
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
                            }}
                            style={styles.foodImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>
            </View>

            {/* Map Preview */}
            <View style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                    <Text style={styles.mapIcon}>🗺️</Text>
                    <View style={styles.preparingBadge}>
                        <View style={styles.preparingDot} />
                        <Text style={styles.preparingText}>PREPARING YOUR MEAL</Text>
                    </View>
                </View>
            </View>

            {/* Track Order Button */}
            <TouchableOpacity style={styles.trackButton} onPress={handleTrackOrder}>
                <Text style={styles.trackIcon}>🔄</Text>
                <Text style={styles.trackText}>TRACK MY ORDER</Text>
            </TouchableOpacity>

            {/* Order Details Link */}
            <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsText}>Order details</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: 24,
        paddingTop: 50,
    },
    closeButton: {
        alignSelf: 'flex-start',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    successContainer: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 24,
    },
    successCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#00E5FF33',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        fontSize: 40,
        color: '#000000',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#9E9E9E',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    highlight: {
        color: '#00E5FF',
        fontWeight: '600',
    },
    orderCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    orderHeader: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    arrivalLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#00E5FF',
        letterSpacing: 1,
    },
    orderContent: {
        flexDirection: 'row',
        padding: 16,
        paddingTop: 8,
    },
    orderInfo: {
        flex: 1,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    orderDetails: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 8,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    addressText: {
        fontSize: 12,
        color: '#00E5FF',
    },
    foodImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
    },
    foodImage: {
        width: '100%',
        height: '100%',
    },
    mapContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },
    mapPlaceholder: {
        height: 120,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    preparingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00000099',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    preparingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00E5FF',
        marginRight: 8,
    },
    preparingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    trackButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    trackIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    trackText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        letterSpacing: 0.5,
    },
    detailsButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    detailsText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
});

export default OrderSuccessScreen;
