import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    onRetry?: () => void;
};

export const PaymentFailedScreen: React.FC<Props> = ({ navigation, onRetry }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Close Button */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.closeIcon}></Text>
            </TouchableOpacity>

            {/* Error Illustration */}
            <View style={styles.illustrationContainer}>
                <View style={styles.errorCircle}>
                    <Text style={styles.errorIcon}></Text>
                </View>
            </View>

            {/* Error Message */}
            <Text style={styles.title}>Payment Failed</Text>
            <Text style={styles.subtitle}>
                We couldn't process your payment. Please try again or use a different payment method.
            </Text>

            {/* Error Details */}
            <View style={styles.errorCard}>
                <View style={styles.errorRow}>
                    <Text style={styles.errorLabel}>Error Code</Text>
                    <Text style={styles.errorValue}>PAY_ERR_502</Text>
                </View>
                <View style={styles.errorRow}>
                    <Text style={styles.errorLabel}>Amount</Text>
                    <Text style={styles.errorValue}>42.50</Text>
                </View>
                <View style={styles.errorRow}>
                    <Text style={styles.errorLabel}>Payment Method</Text>
                    <Text style={styles.errorValue}> 4242</Text>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryText}>TRY AGAIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.changeMethodButton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.changeMethodText}>Change Payment Method</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportButton}>
                    <Text style={styles.supportText}>Contact Support</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const GenericErrorScreen: React.FC<Props> = ({ navigation, onRetry }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Close Button */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.closeIcon}></Text>
            </TouchableOpacity>

            {/* Error Illustration */}
            <View style={styles.illustrationContainer}>
                <View style={styles.oopsCircle}>
                    <Text style={styles.oopsEmoji}></Text>
                </View>
            </View>

            {/* Error Message */}
            <Text style={styles.title}>Oops!</Text>
            <Text style={styles.subtitle}>
                Something went wrong. We're working on fixing this. Please try again later.
            </Text>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryText}>RETRY</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.navigate('HomeTab')}>
                    <Text style={styles.homeButtonText}>Go to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const LocationUnserviceableScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Close Button */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.closeIcon}></Text>
            </TouchableOpacity>

            {/* Illustration */}
            <View style={styles.illustrationContainer}>
                <View style={styles.locationCircle}>
                    <Text style={styles.locationEmoji}></Text>
                </View>
            </View>

            {/* Message */}
            <Text style={styles.title}>Location Not Serviceable</Text>
            <Text style={styles.subtitle}>
                Sorry, we don't deliver to your current location yet. We're expanding fast!
            </Text>

            {/* Map Placeholder */}
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapIcon}></Text>
                <Text style={styles.mapText}>You are outside our delivery zone</Text>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.retryText}>CHANGE LOCATION</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.notifyButton}>
                    <Text style={styles.notifyText}>Notify When Available</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const RestaurantClosedScreen: React.FC<Props> = ({ navigation }) => {
    const openTime = '11:00 AM';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Close Button */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.closeIcon}></Text>
            </TouchableOpacity>

            {/* Illustration */}
            <View style={styles.illustrationContainer}>
                <View style={styles.closedCircle}>
                    <Text style={styles.closedEmoji}></Text>
                </View>
            </View>

            {/* Message */}
            <Text style={styles.title}>Restaurant Closed</Text>
            <Text style={styles.subtitle}>
                This restaurant is currently closed. They'll be back at {openTime}.
            </Text>

            {/* Schedule Info */}
            <View style={styles.scheduleCard}>
                <Text style={styles.scheduleIcon}></Text>
                <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleTitle}>Opens at {openTime}</Text>
                    <Text style={styles.scheduleSubtitle}>Tomorrow</Text>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.preorderButton}>
                    <Text style={styles.preorderText}> SCHEDULE PRE-ORDER</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.browseButton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.browseText}>Browse Other Restaurants</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: 24,
        paddingTop: 50,
    },
    closeButton: {
        alignSelf: 'flex-start',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    illustrationContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 32,
    },
    errorCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FF525233',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorIcon: {
        fontSize: 48,
        color: '#FF5252',
        fontWeight: 'bold',
    },
    oopsCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFB30033',
        justifyContent: 'center',
        alignItems: 'center',
    },
    oopsEmoji: {
        fontSize: 48,
    },
    locationCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#00E5FF33',
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationEmoji: {
        fontSize: 48,
    },
    closedCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#6B4EFF33',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closedEmoji: {
        fontSize: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#9E9E9E',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    errorCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
    },
    errorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    errorLabel: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    errorValue: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    mapPlaceholder: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        marginBottom: 32,
    },
    mapIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    mapText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    scheduleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
    },
    scheduleIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    scheduleInfo: {
        flex: 1,
    },
    scheduleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    scheduleSubtitle: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    actionsContainer: {
        marginTop: 'auto',
        marginBottom: 40,
    },
    retryButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    retryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    changeMethodButton: {
        backgroundColor: '#2A2A2A',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    changeMethodText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    supportButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    supportText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    homeButton: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    homeButtonText: {
        fontSize: 16,
        color: '#00E5FF',
    },
    notifyButton: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    notifyText: {
        fontSize: 16,
        color: '#00E5FF',
    },
    preorderButton: {
        backgroundColor: '#6B4EFF',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    preorderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    browseButton: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    browseText: {
        fontSize: 16,
        color: '#00E5FF',
    },
});

export default PaymentFailedScreen;
