import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';

interface GlassmorphismCardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    intensity?: 'light' | 'medium' | 'heavy';
    borderColor?: string;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
    children,
    style,
    intensity = 'medium',
    borderColor = '#00E5FF',
}) => {
    const intensityMap = {
        light: { bg: '#1A1A1A80', border: `${borderColor}20` },
        medium: { bg: '#1A1A1ABF', border: `${borderColor}33` },
        heavy: { bg: '#1A1A1AFF', border: `${borderColor}50` },
    };

    const { bg, border } = intensityMap[intensity];

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: bg,
                    borderColor: border,
                },
                style,
            ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#00E5FF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
});

export default GlassmorphismCard;
