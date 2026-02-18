import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SCREENS } from '../../../constants';
import { useAuthStore } from '../../../store/authStore';
import { BackButton } from '../../../components/ui/BackButton';
import {
    startSmsConsent,
    stopSmsConsent,
    addSmsConsentListener,
    removeSmsConsentListeners,
    SmsUserConsentEvent,
} from '../../../native-modules/SmsUserConsent';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

// Extract 6-digit OTP from SMS message
const extractOtpFromMessage = (message: string): string | null => {
    const match = message.match(/\b\d{6}\b/);
    return match ? match[0] : null;
};

export const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
    const phone = route.params?.phone || '+91 XXXXXXXXXX';
    const devOtp = route.params?.devOtp;
    const [isBypass, setIsBypass] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(45);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [smsStatus, setSmsStatus] = useState<'idle' | 'listening' | 'received' | 'denied' | 'error'>('idle');
    const [smsError, setSmsError] = useState<string | null>(null);
    const inputRefs = useRef<TextInput[]>([]);
    const verifyOTP = useAuthStore((state) => state.verifyOTP);
    const requestOTP = useAuthStore((state) => state.requestOTP);

    // Hard bypass credential (as requested): auto-fill and auto-submit OTP.
    useEffect(() => {
        const digits = String(phone || '').replace(/\D/g, '');
        const last10 = digits.length >= 10 ? digits.slice(-10) : '';
        if (last10 === '9876543210') {
            setIsBypass(true);
            // Force-fill and force-submit so we know exactly what is being verified.
            setOtp(['1', '2', '3', '4', '5', '6']);
            setTimeout(() => handleVerify('123456'), 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phone]);

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Handle SMS event from native module
    const handleSmsEvent = useCallback((event: SmsUserConsentEvent) => {
        console.log('[SMS User Consent] Event:', event.status);
        
        switch (event.status) {
            case 'success':
                // Extract OTP from SMS message
                const otpCode = extractOtpFromMessage(event.message);
                if (otpCode) {
                    console.log('[SMS User Consent] OTP extracted:', otpCode);
                    setSmsStatus('received');
                    autoFillOtp(otpCode);
                } else {
                    console.log('[SMS User Consent] No 6-digit OTP found in message');
                    setSmsStatus('error');
                    setSmsError('Could not read OTP from SMS');
                }
                break;
                
            case 'denied':
                console.log('[SMS User Consent] User denied permission');
                setSmsStatus('denied');
                setSmsError('SMS access denied. Please enter OTP manually.');
                // Clear error after 3 seconds
                setTimeout(() => {
                    setSmsStatus('idle');
                    setSmsError(null);
                }, 3000);
                break;
                
            case 'timeout':
                console.log('[SMS User Consent] Timeout');
                setSmsStatus('idle');
                break;
                
            case 'error':
                console.error('[SMS User Consent] Error:', event.message);
                setSmsStatus('error');
                setSmsError(event.message);
                break;
        }
    }, []);

    // Setup SMS User Consent listener
    useEffect(() => {
        if (Platform.OS !== 'android') return;

        let subscription: any = null;

        const setupSmsConsent = async () => {
            try {
                // Add event listener
                subscription = addSmsConsentListener(handleSmsEvent);
                
                // Start SMS consent with a delay to let screen fully load
                setTimeout(async () => {
                    try {
                        await startSmsConsent();
                        setSmsStatus('listening');
                        console.log('[SMS User Consent] Started successfully');
                    } catch (error: any) {
                        console.log('[SMS User Consent] Start failed:', error.message);
                        setSmsStatus('idle');
                    }
                }, 1500);
                
            } catch (error: any) {
                console.error('[SMS User Consent] Setup error:', error.message);
            }
        };

        setupSmsConsent();

        return () => {
            // Cleanup
            if (subscription) {
                subscription.remove();
            }
            removeSmsConsentListeners();
            stopSmsConsent().catch(() => {});
        };
    }, [handleSmsEvent]);

    // Auto-fill OTP from SMS
    const autoFillOtp = (otpString: string) => {
        if (otpString.length === 6 && /^\d{6}$/.test(otpString)) {
            const otpArray = otpString.split('');
            setOtp(otpArray);
            
            // Auto-submit after a short delay to let user see the filled OTP
            setTimeout(() => {
                handleVerify(otpString);
            }, 800);
        }
    };

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
                // Check if profile is already complete
                if (result.isProfileComplete) {
                    // User has completed profile, go directly to Main app
                    console.log('[Auth] Profile complete, navigating to Main');
                    navigation.navigate(SCREENS.HOME);
                } else {
                    // New user or incomplete profile, go to Profile Setup
                    console.log('[Auth] Profile incomplete, navigating to Profile Setup');
                    navigation.navigate(SCREENS.PROFILE_SETUP);
                }
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
                setSmsStatus('idle');
                setSmsError(null);
                inputRefs.current[0]?.focus();
                Alert.alert('OTP Sent', 'A new verification code has been sent to your phone.');
                
                // Restart SMS User Consent
                setTimeout(async () => {
                    try {
                        await stopSmsConsent();
                        await startSmsConsent();
                        setSmsStatus('listening');
                    } catch (error: any) {
                        console.log('[SMS User Consent] Restart failed:', error.message);
                    }
                }, 1000);
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
            <BackButton onPress={() => navigation.goBack()} />

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Verify Identity</Text>
                <Text style={styles.subtitle}>
                    We've sent a 6-digit verification code to{' '}
                    <Text style={styles.phoneText}>{phone}</Text>
                </Text>

                {/* Development OTP Hint */}
                {__DEV__ && (devOtp || isBypass) && (
                    <View style={styles.devHint}>
                        <Text style={styles.devHintText}>
                            Dev OTP: {isBypass ? '123456 (bypass)' : devOtp}
                        </Text>
                    </View>
                )}

                {/* SMS User Consent Status */}
                {Platform.OS === 'android' && smsStatus === 'listening' && (
                    <View style={styles.smsHint}>
                        <Text style={styles.smsHintText}>
                             Waiting for OTP SMS...
                        </Text>
                        <Text style={styles.smsHintSubtext}>
                            You'll see a system popup when SMS arrives
                        </Text>
                    </View>
                )}
                {smsStatus === 'denied' && (
                    <View style={[styles.smsHint, styles.smsHintWarning]}>
                        <Text style={styles.smsHintText}>[!] SMS access denied</Text>
                        <Text style={styles.smsHintSubtext}>
                            Please enter OTP manually
                        </Text>
                    </View>
                )}
                {smsStatus === 'received' && (
                    <View style={[styles.smsHint, styles.smsHintSuccess]}>
                        <Text style={styles.smsHintText}>OK OTP auto-filled!</Text>
                    </View>
                )}
                {smsStatus === 'error' && smsError && (
                    <View style={[styles.smsHint, styles.smsHintError]}>
                        <Text style={styles.smsHintText}>X {smsError}</Text>
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
    smsHint: {
        backgroundColor: '#0A2A2A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#00E5FF33',
        alignItems: 'center',
    },
    smsHintSuccess: {
        backgroundColor: '#0A2A1A',
        borderColor: '#00C85333',
    },
    smsHintWarning: {
        backgroundColor: '#2A1A0A',
        borderColor: '#FFB30033',
    },
    smsHintError: {
        backgroundColor: '#2A0A0A',
        borderColor: '#FF525233',
    },
    smsHintText: {
        color: '#00E5FF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    smsHintSubtext: {
        color: '#9E9E9E',
        fontSize: 12,
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
