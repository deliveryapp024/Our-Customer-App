import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
    Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
}) => {
    const shimmerProgress = useSharedValue(0);

    useEffect(() => {
        shimmerProgress.value = withRepeat(
            withTiming(1, {
                duration: 1500,
                easing: Easing.ease,
            }),
            -1,
            false
        );
    }, []);

    const shimmerStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            shimmerProgress.value,
            [0, 1],
            [-SCREEN_WIDTH, SCREEN_WIDTH]
        );
        return {
            transform: [{ translateX }],
        };
    });

    const widthValue = typeof width === 'number' ? width : '100%';

    return (
        <View
            style={[
                styles.container,
                {
                    width: widthValue,
                    height,
                    borderRadius,
                },
                style,
            ]}>
            {/* Base background */}
            <View style={styles.background} />
            
            {/* Shimmer overlay - using pure Reanimated instead of LinearGradient */}
            <Animated.View
                style={[
                    styles.shimmerContainer,
                    shimmerStyle,
                ]}>
                <View style={styles.shimmerGradient} />
            </Animated.View>
        </View>
    );
};

// Pre-built skeleton layouts
export const RestaurantCardSkeleton: React.FC = () => (
    <View style={styles.cardContainer}>
        <Skeleton width={200} height={120} borderRadius={12} />
        <View style={styles.cardContent}>
            <Skeleton width={140} height={16} borderRadius={4} />
            <View style={styles.row}>
                <Skeleton width={80} height={12} borderRadius={4} />
                <Skeleton width={40} height={20} borderRadius={4} />
            </View>
            <Skeleton width={100} height={12} borderRadius={4} />
        </View>
    </View>
);

export const CategorySkeleton: React.FC = () => (
    <View style={styles.categoryContainer}>
        <Skeleton width={56} height={56} borderRadius={28} />
        <Skeleton width={50} height={12} borderRadius={4} style={styles.categoryText} />
    </View>
);

export const HomeSkeleton: React.FC = () => (
    <View style={styles.homeContainer}>
        {/* Header skeleton */}
        <View style={styles.headerRow}>
            <Skeleton width={150} height={40} borderRadius={8} />
            <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        
        {/* Search skeleton */}
        <Skeleton width="100%" height={48} borderRadius={12} />
        
        {/* Main cards skeleton */}
        <View style={styles.mainCardsRow}>
            <Skeleton width="48%" height={160} borderRadius={16} />
            <Skeleton width="48%" height={160} borderRadius={16} />
        </View>
        
        {/* Quick actions skeleton */}
        <View style={styles.quickActionsRow}>
            <Skeleton width={80} height={36} borderRadius={18} />
            <Skeleton width={80} height={36} borderRadius={18} />
            <Skeleton width={80} height={36} borderRadius={18} />
        </View>
        
        {/* Section title skeleton */}
        <Skeleton width={180} height={24} borderRadius={4} />
        
        {/* Restaurant cards skeleton */}
        <View style={styles.restaurantsRow}>
            <RestaurantCardSkeleton />
            <RestaurantCardSkeleton />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: '#1A1A1A',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#252525',
    },
    shimmerContainer: {
        ...StyleSheet.absoluteFillObject,
        width: '200%',
        height: '100%',
    },
    shimmerGradient: {
        width: '50%',
        height: '100%',
        backgroundColor: '#FFFFFF10',
    },
    // Pre-built layout styles
    cardContainer: {
        width: 200,
        marginRight: 16,
    },
    cardContent: {
        padding: 12,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryContainer: {
        alignItems: 'center',
        width: (SCREEN_WIDTH - 64) / 4,
    },
    categoryText: {
        marginTop: 8,
    },
    homeContainer: {
        padding: 16,
        gap: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickActionsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    restaurantsRow: {
        flexDirection: 'row',
        gap: 16,
    },
});

export default Skeleton;
