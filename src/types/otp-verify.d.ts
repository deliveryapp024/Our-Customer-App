declare module '@pushpendersingh/react-native-otp-verify' {
    export interface SmsMessage {
        message: string | null;
        status: 'success' | 'timeout' | 'error';
        senderAddress?: string;
    }

    /**
     * Starts the SMS Retriever API (automatic - requires app hash in SMS)
     */
    export function startSmsRetriever(): Promise<string>;

    /**
     * Starts the SMS User Consent API (shows consent dialog when SMS arrives)
     */
    export function requestPhoneNumber(): Promise<string>;

    /**
     * Gets the app signature hash (11 characters) for SMS formatting
     */
    export function getAppSignature(): Promise<string>;

    /**
     * Adds a listener for incoming SMS events
     */
    export function addSmsListener(callback: (message: SmsMessage) => void): () => void;

    /**
     * Removes the SMS listener
     */
    export function removeSmsListener(): Promise<string>;

    /**
     * Extracts OTP from SMS message using regex
     * Default pattern matches 4-8 digit codes
     */
    export function extractOtp(message: string, pattern?: RegExp): string | null;
}
