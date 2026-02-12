import {
    NativeModules,
    NativeEventEmitter,
    Platform,
    EmitterSubscription,
} from 'react-native';

/**
 * SMS User Consent Native Module Interface
 * Compatible with React Native 0.76+ (TurboModules)
 */
interface SmsUserConsentNativeModule {
    startSmsConsent(): Promise<boolean>;
    stopSmsConsent(): Promise<boolean>;
    isListening(): Promise<boolean>;
}

/**
 * SMS Event data structure
 */
export interface SmsUserConsentEvent {
    status: 'success' | 'denied' | 'timeout' | 'error';
    message: string;
}

// Get the native module
const { SmsUserConsent } = NativeModules as {
    SmsUserConsent?: SmsUserConsentNativeModule;
};

// Event emitter for SMS events
let eventEmitter: NativeEventEmitter | null = null;
if (SmsUserConsent) {
    eventEmitter = new NativeEventEmitter(NativeModules.SmsUserConsent);
}

/**
 * Start SMS User Consent API
 * Shows system dialog when SMS arrives
 * @returns Promise that resolves when listening starts
 */
export const startSmsConsent = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        throw new Error('SMS User Consent is only available on Android');
    }
    if (!SmsUserConsent) {
        throw new Error('SmsUserConsent native module not found');
    }
    return SmsUserConsent.startSmsConsent();
};

/**
 * Stop SMS User Consent API
 * @returns Promise that resolves when listening stops
 */
export const stopSmsConsent = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        return false;
    }
    if (!SmsUserConsent) {
        return false;
    }
    return SmsUserConsent.stopSmsConsent();
};

/**
 * Check if SMS consent is currently active
 * @returns Promise that resolves with listening status
 */
export const isSmsConsentListening = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        return false;
    }
    if (!SmsUserConsent) {
        return false;
    }
    return SmsUserConsent.isListening();
};

/**
 * Add listener for SMS events
 * @param callback Function called when SMS is received or error occurs
 * @returns EmitterSubscription that can be used to remove listener
 */
export const addSmsConsentListener = (
    callback: (event: SmsUserConsentEvent) => void
): EmitterSubscription | null => {
    if (Platform.OS !== 'android' || !eventEmitter) {
        return null;
    }
    return eventEmitter.addListener('SmsUserConsentReceived', callback);
};

/**
 * Remove all SMS consent listeners
 */
export const removeSmsConsentListeners = (): void => {
    if (eventEmitter) {
        eventEmitter.removeAllListeners('SmsUserConsentReceived');
    }
};

/**
 * Default export with all methods
 */
export default {
    startSmsConsent,
    stopSmsConsent,
    isSmsConsentListening,
    addSmsConsentListener,
    removeSmsConsentListeners,
};
