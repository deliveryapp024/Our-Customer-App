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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS } from '../../../constants';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export const MobileInputScreen: React.FC<Props> = ({ navigation }) => {
    const [countryCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleContinue = () => {
        // No validation required - just go to next screen
        navigation.navigate(SCREENS.OTP_VERIFICATION, { phone: countryCode + phoneNumber });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Enter your mobile{'\n'}number</Text>
                <Text style={styles.subtitle}>
                    We'll send a verification code to your phone to keep your account secure.
                </Text>

                {/* Phone Input */}
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.countryCode}>
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
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                    <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
