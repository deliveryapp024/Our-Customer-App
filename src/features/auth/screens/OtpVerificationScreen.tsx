import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SCREENS } from '../../../constants';
import { useAuthStore } from '../../../store/authStore';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

export const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
    const phone = route.params?.phone || '+91 XXXXXXXXXX';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(45);
    const inputRefs = useRef<TextInput[]>([]);
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        try {
            // No validation - just proceed to next screen
            const otpString = otp.join('');
            const success = await login(phone, otpString);
            if (success) {
                navigation.navigate(SCREENS.PROFILE_SETUP);
            } else {
                // Even if login fails, proceed for demo
                navigation.navigate(SCREENS.PROFILE_SETUP);
            }
        } catch (error) {
            console.error('Verify error:', error);
            // Proceed anyway for smooth flow
            navigation.navigate(SCREENS.PROFILE_SETUP);
        }
    };

    const handleResend = () => {
        setTimer(45);
        setOtp(['', '', '', '', '', '']);
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

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Verify Identity</Text>
                <Text style={styles.subtitle}>
                    We've sent a 6-digit verification code to{' '}
                    <Text style={styles.phoneText}>{phone}</Text>
                </Text>

                {/* OTP Input */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref!)}
                            style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={({ nativeEvent }) =>
                                handleKeyPress(index, nativeEvent.key)
                            }
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                {/* Resend Timer */}
                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive the code?</Text>
                    {timer > 0 ? (
                        <Text style={styles.timerText}>
                            Resend code in 0:{timer.toString().padStart(2, '0')}
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendLink}>Resend Code</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Verify Button - Always enabled */}
                <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={handleVerify}
                    activeOpacity={0.8}>
                    <Text style={styles.verifyButtonText}>Verify Now</Text>
                </TouchableOpacity>
            </View>

            {/* Custom Keypad (visual only, system keyboard used) */}
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
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
    phoneText: {
        color: '#00E5FF',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    otpInput: {
        width: 50,
        height: 56,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00E5FF',
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#2A2A2A',
    },
    otpInputFilled: {
        borderColor: '#00E5FF',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    resendText: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 4,
    },
    timerText: {
        fontSize: 14,
        color: '#FFB300',
    },
    resendLink: {
        fontSize: 14,
        color: '#00E5FF',
        fontWeight: '600',
    },
    verifyButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
    },
    verifyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
});

export default OtpVerificationScreen;
