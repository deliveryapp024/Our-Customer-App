import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';

interface AnimatedCardProps extends TouchableOpacityProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    style,
    onPressIn,
    onPressOut,
    ...props
}) => {
    const pressProgress = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            pressProgress.value,
            [0, 1],
            [1, 0.98],
            Extrapolate.CLAMP
        );
        const elevation = interpolate(
            pressProgress.value,
            [0, 1],
            [0, 4],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ scale }],
            elevation,
            shadowOpacity: elevation * 0.05,
        };
    });

    const handlePressIn = (e: any) => {
        pressProgress.value = withSpring(1, {
            damping: 20,
            stiffness: 400,
        });
        onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
        pressProgress.value = withSpring(0, {
            damping: 20,
            stiffness: 400,
        });
        onPressOut?.(e);
    };

    return (
        <AnimatedTouchable
            activeOpacity={0.95}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[animatedStyle, style]}
            {...props}>
            {children}
        </AnimatedTouchable>
    );
};

export default AnimatedCard;
