import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS, STACKS } from '../../../constants';
import { useAuthStore } from '../../../store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface SavedAddress {
    id: string;
    label: string;
    address: string;
    icon: string;
}

const savedAddresses: SavedAddress[] = [
    { id: '1', label: 'Home', address: 'Add your home address', icon: '🏠' },
    { id: '2', label: 'Work', address: 'Add your work address', icon: '💼' },
];

export const LocationPickerScreen: React.FC<Props> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const setOnboardingComplete = useAuthStore((state) => state.setOnboardingComplete);

    const handleUseCurrentLocation = () => {
        // Would use react-native-geolocation-service here
        // For now, just proceed
        handleContinue();
    };

    const handleContinue = async () => {
        try {
            // Mark onboarding as complete
            await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
            setOnboardingComplete(true);

            // Navigate to main app - reset navigation stack
            navigation.reset({
                index: 0,
                routes: [{ name: STACKS.MAIN }],
            });
        } catch (error) {
            console.error('Location picker error:', error);
            // Try alternative navigation
            try {
                setOnboardingComplete(true);
                navigation.navigate(STACKS.MAIN);
            } catch (e) {
                console.error('Navigation failed:', e);
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.headerTitle}>Set Location</Text>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for area, street name..."
                        placeholderTextColor="#6B6B6B"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Use Current Location */}
                <TouchableOpacity
                    style={styles.currentLocationButton}
                    onPress={handleUseCurrentLocation}
                    activeOpacity={0.7}>
                    <View style={styles.locationIconContainer}>
                        <Text style={styles.locationIcon}>📍</Text>
                    </View>
                    <View style={styles.locationTextContainer}>
                        <Text style={styles.currentLocationText}>Use current location</Text>
                        <Text style={styles.currentLocationSubtext}>
                            Enable location services for best experience
                        </Text>
                    </View>
                    <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Saved Addresses */}
                <Text style={styles.sectionTitle}>Saved Addresses</Text>
                {savedAddresses.map((addr) => (
                    <TouchableOpacity
                        key={addr.id}
                        style={styles.addressCard}
                        activeOpacity={0.7}>
                        <Text style={styles.addressIcon}>{addr.icon}</Text>
                        <View style={styles.addressTextContainer}>
                            <Text style={styles.addressLabel}>{addr.label}</Text>
                            <Text style={styles.addressText}>{addr.address}</Text>
                        </View>
                        <Text style={styles.addIcon}>+</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginLeft: 16,
    },
    backIcon: {
        fontSize: 20,
        color: '#FFFFFF',
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
        paddingTop: 32,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 12,
    },
    currentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A2A2A',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    locationIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#00E5FF20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    locationIcon: {
        fontSize: 20,
    },
    locationTextContainer: {
        flex: 1,
    },
    currentLocationText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00E5FF',
        marginBottom: 2,
    },
    currentLocationSubtext: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    arrowIcon: {
        fontSize: 20,
        color: '#00E5FF',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#2A2A2A',
    },
    dividerText: {
        fontSize: 12,
        color: '#6B6B6B',
        marginHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    addressIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    addressTextContainer: {
        flex: 1,
    },
    addressLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    addressText: {
        fontSize: 14,
        color: '#6B6B6B',
    },
    addIcon: {
        fontSize: 24,
        color: '#00E5FF',
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

export default LocationPickerScreen;
