import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Dimensions,
} from 'react-native';

const WELCOME_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFaFkutz2Ezm8up5-gZ-Prk2s9pBtlDiWmMU9J4x4asVOjjZ0vUMk1VpzBd26tt7X4_xRAxNMIpcMe6C6Y_q6tZEaSf64zJkczLOTIpJPl-oCM2WNfpXu_KYpGZ5mGQZby0vEueeU1_HqKhS52x-xbrOu0fUs-bfynGLkCfk-G26mQzuya6QqvOlhBo792bW69oZlJH-oQWTdCpTnxHvlXqAJVj5aS5axOjDNDrMKRwkxog0th3r6rD-TlWrwjjx1lvTSW_vyN7mYu';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS } from '../../../constants';

const { height } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Hero Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: WELCOME_IMAGE}}
                    style={styles.heroImage}
                    resizeMode="cover"
                />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>One app for food,{'\n'}grocery & more</Text>
                <Text style={styles.subtitle}>
                    Premium delivery at your doorstep with lightning speed and exclusive deals.
                </Text>

                {/* Pagination dots */}
                <View style={styles.dots}>
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>

                {/* Buttons */}
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate(SCREENS.MOBILE_INPUT)}
                    activeOpacity={0.8}>
                    <Text style={styles.primaryButtonText}>Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate(SCREENS.MOBILE_INPUT)}
                    activeOpacity={0.8}>
                    <Text style={styles.secondaryButtonText}>Sign In</Text>
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
    imageContainer: {
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#9E9E9E',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4A4A4A',
        marginHorizontal: 4,
    },
    dotActive: {
        width: 24,
        backgroundColor: '#00E5FF',
    },
    primaryButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    secondaryButton: {
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4A4A4A',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default WelcomeScreen;
