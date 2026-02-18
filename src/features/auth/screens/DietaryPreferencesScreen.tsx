import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS } from '../../../constants';
import { useAuthStore } from '../../../store/authStore';
import type { DietaryPreference } from '../../../types';
import { BackButton } from '../../../components/ui/BackButton';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface PreferenceOption {
    id: DietaryPreference;
    label: string;
    icon: string;
    color: string;
}

const preferences: PreferenceOption[] = [
    { id: 'veg', label: 'Vegetarian', icon: '', color: '#00C853' },
    { id: 'non-veg', label: 'Non-Vegetarian', icon: '', color: '#FF5252' },
    { id: 'vegan', label: 'Vegan', icon: '', color: '#00E5FF' },
    { id: 'eggetarian', label: 'Eggetarian', icon: '', color: '#FFB300' },
];

export const DietaryPreferencesScreen: React.FC<Props> = ({ navigation }) => {
    const [selected, setSelected] = useState<DietaryPreference[]>([]);
    const setUser = useAuthStore((state) => state.setUser);
    const user = useAuthStore((state) => state.user);

    const togglePreference = (pref: DietaryPreference) => {
        setSelected((prev) =>
            prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
        );
    };

    const handleContinue = () => {
        try {
            // Update user preferences if any selected (optional)
            if (selected.length > 0 && user) {
                setUser({
                    ...user,
                    dietaryPreferences: selected,
                });
            }
            // Always proceed - no mandatory fields
            navigation.navigate(SCREENS.LOCATION_PICKER);
        } catch (error) {
            console.error('Dietary preferences error:', error);
            // Proceed anyway for smooth flow
            navigation.navigate(SCREENS.LOCATION_PICKER);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Back Button */}
            <BackButton onPress={() => navigation.goBack()} />

            {/* Header */}
            <Text style={styles.headerTitle}>Dietary Preferences</Text>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>What do you prefer?</Text>
                <Text style={styles.subtitle}>
                    Select your dietary preferences to get personalized recommendations.
                    You can change this later.
                </Text>

                {/* Preference Options */}
                <View style={styles.optionsContainer}>
                    {preferences.map((pref) => (
                        <TouchableOpacity
                            key={pref.id}
                            style={[
                                styles.optionCard,
                                selected.includes(pref.id) && styles.optionCardSelected,
                                selected.includes(pref.id) && { borderColor: pref.color },
                            ]}
                            onPress={() => togglePreference(pref.id)}
                            activeOpacity={0.7}>
                            <Text style={styles.optionIcon}>{pref.icon}</Text>
                            <Text style={styles.optionLabel}>{pref.label}</Text>
                            {selected.includes(pref.id) && (
                                <View style={[styles.checkmark, { backgroundColor: pref.color }]}>
                                    <Text style={styles.checkmarkIcon}></Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Continue Button - Always Enabled */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: -34,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#9E9E9E',
        lineHeight: 24,
        marginBottom: 32,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    optionCard: {
        width: '47%',
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2A2A2A',
        position: 'relative',
    },
    optionCardSelected: {
        backgroundColor: '#1A2A2A',
    },
    optionIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    checkmark: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkIcon: {
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    continueButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
});

export default DietaryPreferencesScreen;
