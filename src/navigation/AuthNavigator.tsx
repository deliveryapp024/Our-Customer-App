import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '../constants';
import {
    WelcomeScreen,
    MobileInputScreen,
    OtpVerificationScreen,
    ProfileSetupScreen,
    DietaryPreferencesScreen,
    LocationPickerScreen,
} from '../features/auth';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#000000' },
            }}>
            <Stack.Screen name={SCREENS.WELCOME} component={WelcomeScreen} />
            <Stack.Screen name={SCREENS.MOBILE_INPUT} component={MobileInputScreen} />
            <Stack.Screen
                name={SCREENS.OTP_VERIFICATION}
                component={OtpVerificationScreen}
            />
            <Stack.Screen name={SCREENS.PROFILE_SETUP} component={ProfileSetupScreen} />
            <Stack.Screen
                name={SCREENS.DIETARY_PREFERENCES}
                component={DietaryPreferencesScreen}
            />
            <Stack.Screen
                name={SCREENS.LOCATION_PICKER}
                component={LocationPickerScreen}
            />
        </Stack.Navigator>
    );
};
