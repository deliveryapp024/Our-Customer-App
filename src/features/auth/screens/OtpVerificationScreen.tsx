import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    ActivityIndicator,
    Alert,
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
    const devOtp = route.params?.devOtp;
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(45);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<TextInput[]>([]);
    const verifyOTP = useAuthStore((state) => state.verifyOTP);
    const requestOTP = useAuthStore((state) => state.requestOTP);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        // Only allow digits
        if (value && !/^\d*$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits are filled
        if (index === 5 && value) {
            const otpString = [...newOtp.slice(0, 5), value].join('');
            if (otpString.length === 6) {
                handleVerify(otpString);
            }
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (otpString?: string) => {
        const finalOtp = otpString || otp.join('');

        // Validate OTP length
        if (finalOtp.length !== 6) {
            Alert.alert('Invalid OTP', 'Please enter the 6-digit verification code');
            return;
        }

        setIsLoading(true);

        try {
            const result = await verifyOTP(phone, finalOtp);

            if (result.success) {
                navigation.navigate(SCREENS.PROFILE_SETUP);
            } else {
                Alert.alert('Verification Failed', result.error || 'Invalid OTP. Please try again.');
                // Clear OTP inputs on failure
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);

        try {
            const result = await requestOTP(phone);

            if (result.success) {
                setTimer(45);
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
                Alert.alert('OTP Sent', 'A new verification code has been sent to your phone.');
            } else {
                Alert.alert('Error', result.error || 'Failed to resend OTP. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                disabled={isLoading}>
                <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Verify Identity</Text>
                <Text style={styles.subtitle}>
                    We've sent a 6-digit verification code to{' '}
                    <Text style={styles.phoneText}>{phone}</Text>
                </Text>

                {/* Development OTP Hint */}
                {__DEV__ && devOtp && (
                    <View style={styles.devHint}>
                        <Text style={styles.devHintText}>Dev OTP: {devOtp}</Text>
                    </View>
                )}

                {/* OTP Input */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                if (ref) {
                                    inputRefs.current[index] = ref;
                                }
                            }}
                            style={[
                                styles.otpInput,
                                digit ? styles.otpInputFilled : null,
                                isLoading && styles.otpInputDisabled,
                            ]}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={({ nativeEvent }) =>
                                handleKeyPress(index, nativeEvent.key)
                            }
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                            editable={!isLoading}
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
                        <TouchableOpacity onPress={handleResend} disabled={isResending}>
                            {isResending ? (
                                <ActivityIndicator size="small" color="#00E5FF" />
                            ) : (
                                <Text style={styles.resendLink}>Resend Code</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                    style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
                    onPress={() => handleVerify()}
                    activeOpacity={0.8}
                    disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#000000" />
                    ) : (
                        <Text style={styles.verifyButtonText}>Verify Now</Text>
                    )}
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
    devHint: {
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        padding: 12,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#FFB300',
    },
    devHintText: {
        color: '#FFB300',
        fontSize: 14,
        fontWeight: '600',
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
    otpInputDisabled: {
        opacity: 0.5,
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
    verifyButtonDisabled: {
        opacity: 0.6,
    },
    verifyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
});

export default OtpVerificationScreen;
