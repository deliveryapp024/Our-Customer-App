import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS } from '../../../constants';
import { useAuthStore } from '../../../store/authStore';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const setUser = useAuthStore((state) => state.setUser);
    const user = useAuthStore((state) => state.user);

    const handleContinue = () => {
        try {
            // Update user data if provided (optional)
            if (name || email) {
                setUser({
                    ...user!,
                    name: name || undefined,
                    email: email || undefined,
                });
            }
            // Always proceed - no mandatory fields
            navigation.navigate(SCREENS.DIETARY_PREFERENCES);
        } catch (error) {
            console.error('Profile setup error:', error);
            // Proceed anyway for smooth flow
            navigation.navigate(SCREENS.DIETARY_PREFERENCES);
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
            <Text style={styles.headerTitle}>Profile Setup</Text>

            {/* Content */}
            <View style={styles.content}>
                {/* Profile Photo */}
                <View style={styles.photoContainer}>
                    <View style={styles.photoCircle}>
                        <Text style={styles.cameraIcon}>📷</Text>
                    </View>
                    <TouchableOpacity style={styles.addPhotoButton}>
                        <Text style={styles.addPhotoIcon}>+</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.photoTitle}>Upload Photo</Text>
                <Text style={styles.photoSubtitle}>Add a face to your profile</Text>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        placeholderTextColor="#6B6B6B"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email address"
                        placeholderTextColor="#6B6B6B"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            </View>

            {/* Continue Button - Always Enabled */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}>
                    <Text style={styles.continueButtonText}>Complete Profile</Text>
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
        paddingTop: 40,
        alignItems: 'center',
    },
    photoContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    photoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4A4A4A',
        borderWidth: 3,
        borderColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        fontSize: 32,
    },
    addPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addPhotoIcon: {
        fontSize: 20,
        color: '#000000',
        fontWeight: 'bold',
    },
    photoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    photoSubtitle: {
        fontSize: 14,
        color: '#00E5FF',
        marginBottom: 32,
    },
    formContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 20,
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

export default ProfileSetupScreen;
