import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withTiming,
    withSpring,
    interpolate,
    Extrapolate,
    SharedValue,
} from 'react-native-reanimated';
import { Clock, Star } from 'phosphor-react-native';

const { width } = require('react-native').Dimensions.get('window');

interface AnimatedRestaurantCardProps {
    item: any;
    index: number;
    scrollY?: SharedValue<number>;
    onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedRestaurantCard: React.FC<AnimatedRestaurantCardProps> = ({
    item,
    index,
    scrollY,
    onPress,
}) => {
    const entranceProgress = useSharedValue(0);
    const pressProgress = useSharedValue(0);

    // Staggered entrance animation - runs once on mount
    useEffect(() => {
        // Small initial delay then animate in
        entranceProgress.value = withDelay(
            index * 60,
            withTiming(1, { duration: 400 })
        );
    }, []);

    // Entrance animation style - cards are always visible, animation just adds polish
    const entranceStyle = useAnimatedStyle(() => {
        // Start with slight offset and scale, end at normal
        const translateY = interpolate(
            entranceProgress.value,
            [0, 1],
            [15, 0],
            Extrapolate.CLAMP
        );
        const scale = interpolate(
            entranceProgress.value,
            [0, 1],
            [0.95, 1],
            Extrapolate.CLAMP
        );

        return {
            opacity: 1, // Always visible
            transform: [{ translateY }, { scale }],
        };
    });

    // 3D Tilt based on scroll (if scrollY provided)
    const tiltStyle = useAnimatedStyle(() => {
        if (!scrollY) return {};
        
        // Calculate approximate position of this card
        const cardHeight = 220;
        const headerHeight = 200; // Approximate header + search + main cards
        const sectionTitleHeight = 60;
        const itemPosition = headerHeight + sectionTitleHeight + (index * (cardHeight + 16));
        
        const relativeScroll = scrollY.value - itemPosition;
        
        // 3D tilt effect
        const rotateX = interpolate(
            relativeScroll,
            [-300, 0, 300],
            [8, 0, -8],
            Extrapolate.CLAMP
        );

        const perspective = 1000;

        return {
            transform: [
                { perspective },
                { rotateX: `${rotateX}deg` },
            ],
        };
    });

    // Press animation
    const pressStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            pressProgress.value,
            [0, 1],
            [1, 0.97],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ scale }],
        };
    });

    const handlePressIn = () => {
        pressProgress.value = withSpring(1, { damping: 20, stiffness: 400 });
    };

    const handlePressOut = () => {
        pressProgress.value = withSpring(0, { damping: 20, stiffness: 400 });
    };

    return (
        <AnimatedTouchable
            style={[styles.card, entranceStyle, tiltStyle, pressStyle]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.95}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.image || item.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {item.hasOffer && (
                    <View style={styles.offerBadge}>
                        <Text style={styles.offerText}>{item.offerText}</Text>
                    </View>
                )}
            </View>
            <View style={styles.info}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={styles.ratingBadge}>
                        <Star size={12} color="#000000" weight="fill" />
                        <Text style={styles.ratingText}>{item.rating || 4.0}</Text>
                    </View>
                </View>
                <Text style={styles.cuisine} numberOfLines={1}>
                    {(Array.isArray(item.cuisines) && item.cuisines.length > 0 
                        ? item.cuisines.join(' • ') 
                        : 'Multi-cuisine')} • {item.priceLevel || '₹₹'}
                </Text>
                <View style={styles.deliveryRow}>
                    <Clock size={14} color="#9E9E9E" weight="fill" />
                    <Text style={styles.deliveryText}>
                        {item.deliveryTime || `${item.prepTimeMin || 30} mins`}
                    </Text>
                </View>
            </View>
        </AnimatedTouchable>
    );
};

const styles = StyleSheet.create({
    card: {
        width: width * 0.65,
        marginRight: 16,
        borderRadius: 16,
        backgroundColor: '#1A1A1A',
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        height: 140,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    offerBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: '#00000099',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    offerText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    info: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
        marginRight: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00C853',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    cuisine: {
        fontSize: 12,
        color: '#9E9E9E',
        marginBottom: 4,
    },
    deliveryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    deliveryText: {
        fontSize: 12,
        color: '#9E9E9E',
    },
});

export default AnimatedRestaurantCard;
