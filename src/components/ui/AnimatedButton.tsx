import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
} from 'react-native-reanimated';

interface AnimatedButtonProps extends TouchableOpacityProps {
    children: React.ReactNode;
    scale?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    scale = 0.95,
    onPressIn,
    onPressOut,
    ...props
}) => {
    const pressProgress = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(
            pressProgress.value,
            [0, 1],
            [1, scale]
        );
        return {
            transform: [{ scale: scaleValue }],
        };
    });

    const handlePressIn = (e: any) => {
        pressProgress.value = withSpring(1, {
            damping: 15,
            stiffness: 300,
        });
        onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
        pressProgress.value = withSpring(0, {
            damping: 15,
            stiffness: 300,
        });
        onPressOut?.(e);
    };

    return (
        <AnimatedTouchable
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[animatedStyle]}
            {...props}>
            {children}
        </AnimatedTouchable>
    );
};

export default AnimatedButton;
