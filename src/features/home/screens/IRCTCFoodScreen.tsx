import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ComingSoonScreen from '../../../components/ComingSoonScreen';
import { FEATURE_FLAGS } from '../../../constants';
import { BackButton } from '../../../components/ui/BackButton';

interface Station {
    code: string;
    name: string;
    arrivalTime: string;
    restaurants: number;
}

interface TrainFood {
    id: string;
    name: string;
    restaurant: string;
    price: number;
    image: string;
    isVeg: boolean;
    rating: number;
    prepTime: string;
}

const MOCK_STATIONS: Station[] = [
    { code: 'NDLS', name: 'New Delhi', arrivalTime: '14:30', restaurants: 12 },
    { code: 'CNB', name: 'Kanpur Central', arrivalTime: '18:45', restaurants: 8 },
    { code: 'ALD', name: 'Prayagraj Junction', arrivalTime: '21:15', restaurants: 6 },
];

// Images from home_discovery_hub design
const MOCK_FOOD_ITEMS: TrainFood[] = [
    {
        id: '1',
        name: 'Butter Chicken Thali',
        restaurant: 'Punjab Grill Express',
        price: 249,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo61o96ph2K1uSVuMtrwM6d59ZYddbUxT4pIjs1oS_GKXefNXf7WIC_nLJi7zQ_tWgcONGVykVoVTieuW6oKqCRibspP6iQRZUvnnWkklIxXbHj5wxZwhX1WxQDYkdPCUjU4VJ3QMYOdDYvUd8dv3c-su7FN3YXEXJjWBf-tK0YdfdY-1OFbw_TK5x5zIm_-2g8j9CQvp9lJ8LLQ84RvozbQYgJvnjIcxUOvDLbAeAaKTc2w0JFNP-9W8AJC1Nj0MzwJv2Bk48YxEw',
        isVeg: false,
        rating: 4.5,
        prepTime: '25 min',
    },
    {
        id: '2',
        name: 'Paneer Biryani',
        restaurant: 'Biryani Blues',
        price: 199,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuUDoavxhQe53DGhNkpbhp2j2rMwqKQO1N97BgS9E7rIjarpgCfm0FiDNAHOM3U9eKJuM1Pugksh2VFiAdhCk8Y1qC0YYfl99qigZ2GFgpP83cuc6rGtq5oZK2i4H1TbfdvXfZXwTeP8JvfVvwT8hqpbOevaaDyZsabcUB-AsuwnVm27JPDOwvFudCYyFpezAoA-efMpB-N8XkPw7l6Hzns8sVO1dTOhe1WvNCHtmREitleWqTmRJSaoz7sN9YjpRlFmdH6rAdu25c',
        isVeg: true,
        rating: 4.3,
        prepTime: '20 min',
    },
    {
        id: '3',
        name: 'South Indian Combo',
        restaurant: 'Sagar Ratna',
        price: 179,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh2fIAp9oyd2iKcXdCrUMWQo-idGSY6th2lWcn9JIWULsmhc9WMTTqCmUdFV-PqxqxB9w5UEdfyYF0-jhhPpJz1GJhYuuyTp3snHteh1RUOXUvzOsfLXdiBsMXmrUHqwfmNDqOc6L2jBSJiNSrv844oTPWPbTQDs6snW2cs85oeWC0vTEegACwjG3td5PpsC8Pa07tJPbnHgLKopcnHh7Bcrrm4eLldCAfitrNBxdqO3xzNizP-0HxQEu4LbZBZprZfRFIO3blYvEi',
        isVeg: true,
        rating: 4.4,
        prepTime: '15 min',
    },
    {
        id: '4',
        name: 'Chicken Fried Rice',
        restaurant: 'Wok Express',
        price: 189,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg1Hac2hi31tHaIUsrco1AUdt9EwRhBjTeJ3P0Wh5_6TYMKDCzlx8UHu4liDZJoxSLtlN9yUJMirrP59RBel6fq_yvagtQ2XsWO7CQuEnAgYLYtyYWl46XdXVo-pDxv1HDLsghJ-asBzkhLggH7_cKYmWOkbEeeuj1jHPnpBxb0EwkPM_gDt3d6abw5g5zkPkHHLjcwt4zcH12yKVWS9vGeZqAQes3BSZwlMiZJiq9rYZYvnMQFd_eUcWTbc2KvdcRF7B1Xu9gUcUq',
        isVeg: false,
        rating: 4.2,
        prepTime: '18 min',
    },
];

export const IRCTCFoodScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    if (!FEATURE_FLAGS.ENABLE_IRCTC_FOOD) {
        return (
            <ComingSoonScreen
                title="Train Food is disabled for the pilot"
                subtitle="This screen currently uses mock data. Enable FEATURE_FLAGS.ENABLE_IRCTC_FOOD only after wiring real APIs."
            />
        );
    }

    const [pnrNumber, setPnrNumber] = useState('');
    const [isValidated, setIsValidated] = useState(false);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const validatePNR = () => {
        if (pnrNumber.length === 10) {
            setIsValidated(true);
            setSelectedStation(MOCK_STATIONS[0]);
        } else {
            Alert.alert('Invalid PNR', 'Please enter a valid 10-digit PNR number');
        }
    };

    const toggleItemSelection = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const renderPNRInput = () => (
        <View style={styles.pnrSection}>
            <View style={styles.trainIcon}>
                <Text style={styles.trainEmoji}></Text>
            </View>
            <Text style={styles.pnrTitle}>Food on Train</Text>
            <Text style={styles.pnrSubtitle}>
                Enter your PNR to order food delivered to your seat
            </Text>

            <View style={styles.pnrInputContainer}>
                <TextInput
                    style={styles.pnrInput}
                    placeholder="Enter 10-digit PNR"
                    placeholderTextColor="#666"
                    value={pnrNumber}
                    onChangeText={setPnrNumber}
                    keyboardType="number-pad"
                    maxLength={10}
                />
                <TouchableOpacity style={styles.validateButton} onPress={validatePNR}>
                    <Text style={styles.validateButtonText}>Validate</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoIcon}></Text>
                <Text style={styles.infoText}>
                    You can find your PNR on your ticket or SMS confirmation
                </Text>
            </View>
        </View>
    );

    const renderJourneyDetails = () => (
        <View style={styles.journeySection}>
            <View style={styles.journeyHeader}>
                <Text style={styles.journeyTitle}>Your Journey</Text>
                <TouchableOpacity onPress={() => setIsValidated(false)}>
                    <Text style={styles.changeText}>Change PNR</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.trainCard}>
                <View style={styles.trainInfo}>
                    <Text style={styles.trainNumber}>12302</Text>
                    <Text style={styles.trainName}>Rajdhani Express</Text>
                </View>
                <View style={styles.routeInfo}>
                    <Text style={styles.routeText}>NDLS  HWH</Text>
                    <Text style={styles.dateText}>Feb 5, 2026</Text>
                </View>
            </View>

            {/* Station Selection */}
            <Text style={styles.stationLabel}>Select Delivery Station</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.stationList}
            >
                {MOCK_STATIONS.map((station) => (
                    <TouchableOpacity
                        key={station.code}
                        style={[
                            styles.stationCard,
                            selectedStation?.code === station.code && styles.stationCardActive,
                        ]}
                        onPress={() => setSelectedStation(station)}
                    >
                        <Text style={styles.stationCode}>{station.code}</Text>
                        <Text style={styles.stationName}>{station.name}</Text>
                        <Text style={styles.arrivalTime}>Arrives: {station.arrivalTime}</Text>
                        <Text style={styles.restaurantCount}>
                            {station.restaurants} restaurants
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderFoodItem = (item: TrainFood) => (
        <TouchableOpacity
            key={item.id}
            style={[
                styles.foodCard,
                selectedItems.includes(item.id) && styles.foodCardSelected,
            ]}
            onPress={() => toggleItemSelection(item.id)}
        >
            <Image source={{ uri: item.image }} style={styles.foodImage} />

            <View style={styles.vegBadge}>
                <View
                    style={[styles.vegDot, { backgroundColor: item.isVeg ? '#00C853' : '#FF5252' }]}
                />
            </View>

            <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.restaurantName}>{item.restaurant}</Text>

                <View style={styles.foodMeta}>
                    <Text style={styles.ratingText}> {item.rating}</Text>
                    <Text style={styles.prepTime}> {item.prepTime}</Text>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>{item.price}</Text>
                    <View
                        style={[
                            styles.selectButton,
                            selectedItems.includes(item.id) && styles.selectButtonActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.selectButtonText,
                                selectedItems.includes(item.id) && styles.selectButtonTextActive,
                            ]}
                        >
                            {selectedItems.includes(item.id) ? ' Added' : '+ Add'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const getSelectedTotal = () => {
        return MOCK_FOOD_ITEMS.filter((item) => selectedItems.includes(item.id)).reduce(
            (sum, item) => sum + item.price,
            0
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>IRCTC Food</Text>
                <View style={styles.irctcBadge}>
                    <Text style={styles.irctcText}>IRCTC</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {!isValidated ? (
                    renderPNRInput()
                ) : (
                    <>
                        {renderJourneyDetails()}

                        {/* Food Menu */}
                        <View style={styles.menuSection}>
                            <Text style={styles.menuTitle}>Order Food</Text>
                            <Text style={styles.menuSubtitle}>
                                Delivered to seat {' '}
                                <Text style={styles.seatNumber}>B2-42</Text>
                            </Text>

                            {/* Filter Chips */}
                            <View style={styles.filterRow}>
                                <TouchableOpacity style={styles.filterChipActive}>
                                    <Text style={styles.filterChipTextActive}>All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.filterChip}>
                                    <Text style={styles.filterChipText}> Veg</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.filterChip}>
                                    <Text style={styles.filterChipText}> Non-Veg</Text>
                                </TouchableOpacity>
                            </View>

                            {MOCK_FOOD_ITEMS.map(renderFoodItem)}
                        </View>
                    </>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Cart Bar */}
            {selectedItems.length > 0 && (
                <View style={styles.cartBar}>
                    <View style={styles.cartInfo}>
                        <Text style={styles.cartCount}>{selectedItems.length} items</Text>
                        <Text style={styles.cartTotal}>{getSelectedTotal()}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={() => navigation.navigate('Checkout')}
                    >
                        <Text style={styles.checkoutText}>Place Order </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
    irctcBadge: {
        backgroundColor: '#FF5722',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    irctcText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    pnrSection: {
        alignItems: 'center',
        padding: 24,
    },
    trainIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    trainEmoji: {
        fontSize: 40,
    },
    pnrTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    pnrSubtitle: {
        color: '#9E9E9E',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    pnrInputContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 16,
    },
    pnrInput: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#FFF',
        fontSize: 16,
        marginRight: 12,
    },
    validateButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 12,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    validateButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        borderRadius: 8,
        padding: 12,
        width: '100%',
    },
    infoIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    infoText: {
        color: '#00E5FF',
        fontSize: 13,
        flex: 1,
    },
    journeySection: {
        padding: 16,
    },
    journeyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    journeyTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    changeText: {
        color: '#00E5FF',
        fontSize: 14,
        fontWeight: '600',
    },
    trainCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    trainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    trainNumber: {
        color: '#00E5FF',
        fontSize: 16,
        fontWeight: '700',
        marginRight: 12,
    },
    trainName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    routeInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    routeText: {
        color: '#9E9E9E',
        fontSize: 14,
    },
    dateText: {
        color: '#9E9E9E',
        fontSize: 14,
    },
    stationLabel: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    stationList: {
        marginBottom: 8,
    },
    stationCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        minWidth: 140,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    stationCardActive: {
        borderColor: '#00E5FF',
    },
    stationCode: {
        color: '#00E5FF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    stationName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    arrivalTime: {
        color: '#9E9E9E',
        fontSize: 12,
        marginBottom: 4,
    },
    restaurantCount: {
        color: '#00C853',
        fontSize: 12,
        fontWeight: '600',
    },
    menuSection: {
        padding: 16,
    },
    menuTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    menuSubtitle: {
        color: '#9E9E9E',
        fontSize: 14,
        marginBottom: 16,
    },
    seatNumber: {
        color: '#00E5FF',
        fontWeight: '700',
    },
    filterRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        marginRight: 8,
    },
    filterChipActive: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#00E5FF',
        borderRadius: 20,
        marginRight: 8,
    },
    filterChipText: {
        color: '#9E9E9E',
        fontSize: 13,
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#000',
        fontSize: 13,
        fontWeight: '600',
    },
    foodCard: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    foodCardSelected: {
        borderColor: '#00E5FF',
    },
    foodImage: {
        width: 100,
        height: 100,
        backgroundColor: '#333',
    },
    vegBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    vegDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    foodInfo: {
        flex: 1,
        padding: 12,
    },
    foodName: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    restaurantName: {
        color: '#9E9E9E',
        fontSize: 12,
        marginBottom: 6,
    },
    foodMeta: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    ratingText: {
        color: '#FFD700',
        fontSize: 12,
        marginRight: 12,
    },
    prepTime: {
        color: '#9E9E9E',
        fontSize: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    selectButton: {
        backgroundColor: '#333',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 6,
    },
    selectButtonActive: {
        backgroundColor: '#00E5FF',
    },
    selectButtonText: {
        color: '#00E5FF',
        fontSize: 13,
        fontWeight: '600',
    },
    selectButtonTextActive: {
        color: '#000',
    },
    cartBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1A1A1A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    cartInfo: {
        flex: 1,
    },
    cartCount: {
        color: '#9E9E9E',
        fontSize: 13,
    },
    cartTotal: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    checkoutButton: {
        backgroundColor: '#00E5FF',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    checkoutText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default IRCTCFoodScreen;
