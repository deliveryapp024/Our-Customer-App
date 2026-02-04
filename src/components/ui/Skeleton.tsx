import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
}) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width, height, borderRadius, opacity },
                style,
            ]}
        />
    );
};

export const RestaurantCardSkeleton = () => (
    <View style={styles.cardContainer}>
        <Skeleton height={140} borderRadius={12} />
        <View style={styles.cardContent}>
            <View style={styles.headerRow}>
                <Skeleton width="70%" height={18} />
                <Skeleton width={40} height={24} borderRadius={4} />
            </View>
            <Skeleton width="50%" height={14} style={{ marginTop: 8 }} />
            <Skeleton width="30%" height={14} style={{ marginTop: 8 }} />
        </View>
    </View>
);

export const HomeScreenSkeleton = () => (
    <View style={styles.container}>
        {/* Header Skeleton */}
        <View style={styles.header}>
            <View style={styles.locationRow}>
                <Skeleton width={24} height={24} borderRadius={12} />
                <View style={{ marginLeft: 8, flex: 1 }}>
                    <Skeleton width="60%" height={16} />
                    <Skeleton width="80%" height={12} style={{ marginTop: 4 }} />
                </View>
            </View>
            <Skeleton width={40} height={40} borderRadius={20} />
        </View>

        {/* Search Skeleton */}
        <View style={styles.searchRow}>
            <Skeleton height={50} borderRadius={12} />
        </View>

        {/* Main Cards Skeleton */}
        <View style={styles.mainCards}>
            <Skeleton width="48%" height={160} borderRadius={16} />
            <Skeleton width="48%" height={160} borderRadius={16} />
        </View>

        {/* Quick Actions Skeleton */}
        <View style={styles.quickActions}>
            <Skeleton width={80} height={40} borderRadius={20} />
            <Skeleton width={100} height={40} borderRadius={20} />
            <Skeleton width={70} height={40} borderRadius={20} />
            <Skeleton width={80} height={40} borderRadius={20} />
        </View>

        {/* Section Title Skeleton */}
        <View style={styles.sectionHeader}>
            <Skeleton width="50%" height={20} />
            <Skeleton width={60} height={16} />
        </View>

        {/* Restaurant Cards Skeleton */}
        <View style={styles.cardsRow}>
            <RestaurantCardSkeleton />
            <RestaurantCardSkeleton />
        </View>
    </View>
);

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#2A2A2A',
    },
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    searchRow: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    mainCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 10,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    cardsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 16,
    },
    cardContainer: {
        width: 200,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default Skeleton;
