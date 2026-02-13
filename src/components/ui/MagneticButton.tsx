import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface MagneticButtonProps extends TouchableOpacityProps {
    children: React.ReactNode;
    style?: ViewStyle;
    magneticStrength?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    style,
    magneticStrength = 0.3,
    onPressIn,
    onPressOut,
    ...props
}) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const pressProgress = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onBegin((event) => {
            pressProgress.value = withSpring(1, { damping: 15, stiffness: 300 });
            // Magnetic attraction - move toward touch point
            translateX.value = withSpring(event.x * magneticStrength, {
                damping: 10,
                stiffness: 200,
            });
            translateY.value = withSpring(event.y * magneticStrength, {
                damping: 10,
                stiffness: 200,
            });
        })
        .onUpdate((event) => {
            // Continue following touch with magnetic effect
            translateX.value = event.x * magneticStrength;
            translateY.value = event.y * magneticStrength;
        })
        .onEnd(() => {
            // Spring back to center
            translateX.value = withSpring(0, { damping: 12, stiffness: 200 });
            translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
        })
        .onFinalize(() => {
            pressProgress.value = withSpring(0, { damping: 15, stiffness: 300 });
        });

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            pressProgress.value,
            [0, 1],
            [1, 0.95],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale },
            ],
        };
    });

    return (
        <GestureDetector gesture={gesture}>
            <AnimatedTouchable
                activeOpacity={0.9}
                style={[animatedStyle, style]}
                {...props}>
                {children}
            </AnimatedTouchable>
        </GestureDetector>
    );
};

export default MagneticButton;
