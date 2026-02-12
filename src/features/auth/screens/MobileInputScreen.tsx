import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS } from '../../../constants';
import { useAuthStore } from '../../../store/authStore';
import { CustomModal, ModalButton } from '../../../components/ui/CustomModal';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export const MobileInputScreen: React.FC<Props> = ({ navigation }) => {
    const [countryCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        title: string;
        message: string;
        buttons: ModalButton[];
        icon?: string;
    }>({ title: '', message: '', buttons: [] });
    const requestOTP = useAuthStore((state) => state.requestOTP);

    const showModal = (config: typeof modalConfig) => {
        setModalConfig(config);
        setModalVisible(true);
    };

    const hideModal = () => setModalVisible(false);

    const validatePhoneNumber = (phone: string): boolean => {
        // Indian mobile number validation: 10 digits starting with 6-9
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    };

    const shouldAllowOtpEntry = (message?: string): boolean => {
        if (!message) return false;
        return /(too many|try again later|rate limit|429|wait)/i.test(message);
    };

    const handleContinue = async () => {
        const phone = countryCode + phoneNumber;

        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            showModal({
                title: 'Invalid Mobile Number',
                message: 'Please enter a valid 10-digit mobile number',
                icon: '⚠️',
                buttons: [{ text: 'Got it', style: 'default' }],
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await requestOTP(phone);

            if (result.success) {
                // Navigate to OTP verification screen
                navigation.navigate(SCREENS.OTP_VERIFICATION, {
                    phone,
                    devOtp: result.devOtp, // Pass dev OTP for testing if available
                });
            } else {
                const errorMessage = result.error || 'Failed to send OTP. Please try again.';
                if (shouldAllowOtpEntry(errorMessage)) {
                    showModal({
                        title: 'OTP Request Limited',
                        message: `${errorMessage}\n\nYou can still enter OTP if you already received one.`,
                        icon: '⏱️',
                        buttons: [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Enter OTP', style: 'default', onPress: () => navigation.navigate(SCREENS.OTP_VERIFICATION, { phone }) },
                        ],
                    });
                } else {
                    showModal({
                        title: 'Error',
                        message: errorMessage,
                        icon: '❌',
                        buttons: [{ text: 'OK', style: 'default' }],
                    });
                }
            }
        } catch (error) {
            showModal({
                title: 'Error',
                message: 'Something went wrong. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', style: 'default' }],
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        disabled={isLoading}
                        activeOpacity={0.7}>
                        <View style={styles.backButtonInner}>
                            {/* Chevron left icon using SVG-like shape */}
                            <View style={styles.backArrow}>
                                <View style={styles.chevronLeft} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>Enter your mobile{'\n'}number</Text>
                    <Text style={styles.subtitle}>
                        We'll send a verification code to your phone to keep your account secure.
                    </Text>

                    {/* Phone Input */}
                    <View style={styles.inputContainer}>
                        <TouchableOpacity style={styles.countryCode} disabled={isLoading}>
                            <Text style={styles.countryCodeText}>{countryCode}</Text>
                            <Text style={styles.dropdownIcon}>▼</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.phoneInput}
                            placeholder="Mobile number"
                            placeholderTextColor="#6B6B6B"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            maxLength={10}
                            editable={!isLoading}
                        />
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.termsText}>
                        By continuing, you agree to our{' '}
                        <Text style={styles.linkText}>Terms of Service</Text>
                        {'\n'}and <Text style={styles.linkText}>Privacy Policy</Text>. We may send you transactional SMS.
                    </Text>

                    <TouchableOpacity
                        style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
                        onPress={handleContinue}
                        activeOpacity={0.8}
                        disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#000000" />
                        ) : (
                            <>
                                <Text style={styles.continueButtonText}>Continue</Text>
                                <Text style={styles.arrowIcon}>→</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Custom Modal */}
            <CustomModal
                visible={modalVisible}
                title={modalConfig.title}
                message={modalConfig.message}
                buttons={modalConfig.buttons}
                icon={modalConfig.icon}
                onClose={hideModal}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
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
    inputContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    countryCodeText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginRight: 8,
    },
    dropdownIcon: {
        fontSize: 10,
        color: '#9E9E9E',
    },
    phoneInput: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    termsText: {
        fontSize: 14,
        color: '#6B6B6B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    linkText: {
        color: '#9E9E9E',
        textDecorationLine: 'underline',
    },
    continueButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonDisabled: {
        opacity: 0.6,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginRight: 8,
    },
    arrowIcon: {
        fontSize: 18,
        color: '#000000',
    },
});

export default MobileInputScreen;
