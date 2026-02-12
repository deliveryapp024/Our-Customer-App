import React from 'react';
import {
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';

interface BackButtonProps {
    onPress: () => void;
    disabled?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, disabled = false }) => {
    return (
        <TouchableOpacity
            style={styles.backButton}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}>
            <View style={styles.backButtonInner}>
                {/* Chevron left icon */}
                <View style={styles.backArrow}>
                    <View style={styles.chevronLeft} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        // Larger hit area (48x48 minimum for accessibility)
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonInner: {
        // Visual circle
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
        // Subtle border for depth
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    backArrow: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chevronLeft: {
        width: 12,
        height: 12,
        borderLeftWidth: 2.5,
        borderBottomWidth: 2.5,
        borderColor: '#FFFFFF',
        transform: [{ rotate: '45deg' }],
        marginLeft: 4,
    },
});

export default BackButton;
