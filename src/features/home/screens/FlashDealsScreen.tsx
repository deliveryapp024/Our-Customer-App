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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface FlashDeal {
    id: string;
    restaurantName: string;
    image: string;
    originalPrice: number;
    dealPrice: number;
    discount: string;
    endsIn: number; // seconds
    claimed: number;
    total: number;
}

const flashDeals: FlashDeal[] = [
    {
        id: '1',
        restaurantName: 'The Gourmet Kitchen',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh2fIAp9oyd2iKcXdCrUMWQo-idGSY6th2lWcn9JIWULsmhc9WMTTqCmUdFV-PqxqxB9w5UEdfyYF0-jhhPpJz1GJhYuuyTp3snHteh1RUOXUvzOsfLXdiBsMXmrUHqwfmNDqOc6L2jBSJiNSrv844oTPWPbTQDs6snW2cs85oeWC0vTEegACwjG3td5PpsC8Pa07tJPbnHgLKopcnHh7Bcrrm4eLldCAfitrNBxdqO3xzNizP-0HxQEu4LbZBZprZfRFIO3blYvEi',
        originalPrice: 25.99,
        dealPrice: 12.99,
        discount: '50% OFF',
        endsIn: 3600,
        claimed: 45,
        total: 50,
    },
    {
        id: '2',
        restaurantName: 'Swift Burger Co.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC5vARZsW5066UvblgoPxPCIbg0144cPv7c9etHqj_c_Vz115R9N8sM0CSGW_UKDmzhMrFoLrOv2JfL9rjggmwLfchZ-N9TEI3RgkIMgsGY4js8ok-bPsERSAmc1VBC1ZV4gIywnz1L4TrVqXxcDwOKptJ_A5Qhg02W85oUNPn9-ywmRanfzc6Oj-fZVEgVf5LmEf9qzLHjLk-WmwIUvAZwmstPFUEhp-mhFclgyuwkAPsMARIe1l3cUvJn-_e7l5KXmlT13VPwwjG',
        originalPrice: 18.99,
        dealPrice: 9.99,
        discount: '47% OFF',
        endsIn: 1800,
        claimed: 28,
        total: 30,
    },
    {
        id: '3',
        restaurantName: 'Cyan Spice',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI-c8QszP_pPOf7jrVL7irkdep3O0vXq7fcjUszzjAPHTYBS9_kjmyeo1C8rklt2ijyKoSf8NjFzyODh_PkBjP-EIA4m-EKe2vKa-dD-AxDu9CvyT99y_8pbR_FWCKEeMhU6PHhXMx3E7O2vsHKBYN34Dxps657IB_gJptLzaHnSar11u5njYhUEfV0NPB07XzvYB_P0JCEer0iC38mDX-ilCaGtX6Hjtge7WeB39DbZ2wsUSETZKRYjGETA9eiaPUmRLEIrb4FBUW',
        originalPrice: 32.00,
        dealPrice: 19.99,
        discount: '38% OFF',
        endsIn: 7200,
        claimed: 12,
        total: 25,
    },
];

export const FlashDealsScreen: React.FC<Props> = ({ navigation }) => {
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const initial: { [key: string]: number } = {};
        flashDeals.forEach((deal) => {
            initial[deal.id] = deal.endsIn;
        });
        setTimeLeft(initial);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                const updated = { ...prev };
                Object.keys(updated).forEach((key) => {
                    if (updated[key] > 0) updated[key]--;
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                <View style={styles.headerCenter}>
                    <Text style={styles.flashIcon}>⚡</Text>
                    <Text style={styles.headerTitle}>Flash Deals</Text>
                </View>
                <View style={styles.placeholder} />
            </View>

            {/* Live Banner */}
            <View style={styles.liveBanner}>
                <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.liveBannerText}>
                    Limited time deals • Grab before they're gone!
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {flashDeals.map((deal) => (
                    <View key={deal.id} style={styles.dealCard}>
                        <Image
                            source={{ uri: deal.image }}
                            style={styles.dealImage}
                            resizeMode="cover"
                        />
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{deal.discount}</Text>
                        </View>
                        <View style={styles.dealInfo}>
                            <Text style={styles.restaurantName}>{deal.restaurantName}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.dealPrice}>${deal.dealPrice.toFixed(2)}</Text>
                                <Text style={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</Text>
                            </View>

                            {/* Timer */}
                            <View style={styles.timerRow}>
                                <Text style={styles.timerLabel}>Ends in:</Text>
                                <View style={styles.timerBox}>
                                    <Text style={styles.timerText}>
                                        {formatTime(timeLeft[deal.id] || 0)}
                                    </Text>
                                </View>
                            </View>

                            {/* Progress Bar */}
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${(deal.claimed / deal.total) * 100}%` },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.claimedText}>
                                    {deal.claimed}/{deal.total} claimed
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.grabButton}>
                                <Text style={styles.grabButtonText}>GRAB DEAL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flashIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    liveBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF5252',
        paddingVertical: 10,
        marginBottom: 16,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        marginRight: 6,
    },
    liveText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    liveBannerText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    dealCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        overflow: 'hidden',
    },
    dealImage: {
        width: '100%',
        height: 160,
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#FF5252',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    discountText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    dealInfo: {
        padding: 16,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dealPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00E5FF',
        marginRight: 12,
    },
    originalPrice: {
        fontSize: 16,
        color: '#6B6B6B',
        textDecorationLine: 'line-through',
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    timerLabel: {
        fontSize: 14,
        color: '#9E9E9E',
        marginRight: 8,
    },
    timerBox: {
        backgroundColor: '#FF5252',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    timerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontVariant: ['tabular-nums'],
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#2A2A2A',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FF5252',
        borderRadius: 4,
    },
    claimedText: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    grabButton: {
        backgroundColor: '#00E5FF',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
    },
    grabButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default FlashDealsScreen;
