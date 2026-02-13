import { useEffect } from 'react';
import {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withTiming,
    interpolate,
    Extrapolate,
    SharedValue,
} from 'react-native-reanimated';

interface UseStaggeredAnimationOptions {
    index: number;
    baseDelay?: number;
    duration?: number;
}

export const useStaggeredAnimation = ({
    index,
    baseDelay = 50,
    duration = 400,
}: UseStaggeredAnimationOptions) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        const delay = index * baseDelay;
        progress.value = withDelay(
            delay,
            withTiming(1, { duration })
        );
    }, [index, baseDelay, duration, progress]);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            progress.value,
            [0, 1],
            [0, 1],
            Extrapolate.CLAMP
        );
        const translateY = interpolate(
            progress.value,
            [0, 1],
            [20, 0],
            Extrapolate.CLAMP
        );
        const scale = interpolate(
            progress.value,
            [0, 1],
            [0.95, 1],
            Extrapolate.CLAMP
        );

        return {
            opacity,
            transform: [{ translateY }, { scale }],
        };
    });

    return animatedStyle;
};

// Hook for scroll-based 3D tilt effect
export const useScrollTilt = (scrollY: SharedValue<number>, index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
        // Calculate item position based on index (assuming each card is ~220px tall with margin)
        const itemHeight = 220;
        const itemPosition = index * itemHeight;
        
        // Get the scroll position relative to this item
        const relativeScroll = scrollY.value - itemPosition;
        
        // Calculate tilt based on position in viewport
        const tilt = interpolate(
            relativeScroll,
            [-200, 0, 200],
            [5, 0, -5],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { perspective: 1000 },
                { rotateX: `${tilt}deg` },
            ],
        };
    });

    return animatedStyle;
};

export default useStaggeredAnimation;
