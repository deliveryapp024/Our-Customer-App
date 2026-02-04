import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { RestaurantDetailScreen } from '../features/restaurant';
import { CheckoutScreen, OrderSuccessScreen } from '../features/checkout';
import { OrderTrackingScreen, RateReviewScreen } from '../features/tracking';
import {
    HelpSupportScreen,
    OrderCancelledScreen,
    PaymentsHubScreen,
    SettingsScreen,
    FavoritesScreen,
    SavedAddressesScreen,
    OrderHistoryScreen,
} from '../features/profile';
import { SCREENS, STACKS } from '../constants';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    const { isAuthenticated, isLoading, loadStoredAuth, onboardingComplete } =
        useAuthStore();

    useEffect(() => {
        loadStoredAuth();
    }, [loadStoredAuth]);

    if (isLoading) {
        return null;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#000000' },
            }}>
            {isAuthenticated && onboardingComplete ? (
                <>
                    <Stack.Screen name={STACKS.MAIN} component={MainTabNavigator} />
                    <Stack.Screen
                        name={SCREENS.RESTAURANT_DETAIL}
                        component={RestaurantDetailScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name={SCREENS.CHECKOUT}
                        component={CheckoutScreen}
                        options={{ animation: 'slide_from_bottom' }}
                    />
                    <Stack.Screen
                        name={SCREENS.ORDER_SUCCESS}
                        component={OrderSuccessScreen}
                        options={{ animation: 'fade' }}
                    />
                    <Stack.Screen
                        name={SCREENS.TRACKING}
                        component={OrderTrackingScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name={SCREENS.RATE_REVIEW}
                        component={RateReviewScreen}
                        options={{ animation: 'slide_from_bottom' }}
                    />
                    <Stack.Screen
                        name={SCREENS.HELP_SUPPORT}
                        component={HelpSupportScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name={SCREENS.ORDER_CANCELLED}
                        component={OrderCancelledScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name={SCREENS.PAYMENTS_HUB}
                        component={PaymentsHubScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name={SCREENS.SETTINGS}
                        component={SettingsScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name={SCREENS.FAVORITES}
                        component={FavoritesScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name={SCREENS.SAVED_ADDRESSES}
                        component={SavedAddressesScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name={SCREENS.ORDER_HISTORY}
                        component={OrderHistoryScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                </>
            ) : (
                <Stack.Screen name={STACKS.AUTH} component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
};
