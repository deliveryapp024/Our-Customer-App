import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { RestaurantDetailScreen, FanClubScreen, TableReservationScreen } from '../features/restaurant';
import { CheckoutScreen, OrderSuccessScreen, CouponsWalletScreen } from '../features/checkout';
import { OrderTrackingScreen, RateReviewScreen } from '../features/tracking';
import {
    BoltDeliveryScreen, NinetyNineStoreScreen, FlashDealsScreen, GroupOrderScreen,
    AIComboScreen, DineInScreen, SmartFiltersScreen, TrainDeliveryScreen,
    QuickReorderScreen, FoodStoriesScreen,
} from '../features/home';
import {
    HelpSupportScreen, OrderCancelledScreen, PaymentsHubScreen, SettingsScreen,
    FavoritesScreen, SavedAddressesScreen, OrderHistoryScreen, ReferralScreen,
    OrderReceiptScreen, EcoDashboardScreen, ExpenseStatementsScreen,
} from '../features/profile';
import { PaymentFailedScreen, GenericErrorScreen, LocationUnserviceableScreen, RestaurantClosedScreen } from '../features/common';
import { SCREENS, STACKS, FEATURE_FLAGS } from '../constants';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    const { isAuthenticated, isLoading, loadStoredAuth, onboardingComplete } = useAuthStore();
    useEffect(() => { loadStoredAuth(); }, [loadStoredAuth]);
    if (isLoading) return null;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
            {isAuthenticated && onboardingComplete ? (
                <>
                    <Stack.Screen name={STACKS.MAIN} component={MainTabNavigator} />
                    {/* Restaurant & Checkout */}
                    <Stack.Screen name={SCREENS.RESTAURANT_DETAIL} component={RestaurantDetailScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.CHECKOUT} component={CheckoutScreen} options={{ animation: 'slide_from_bottom' }} />
                    <Stack.Screen name={SCREENS.ORDER_SUCCESS} component={OrderSuccessScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name={SCREENS.COUPONS_WALLET} component={CouponsWalletScreen} options={{ animation: 'slide_from_bottom' }} />
                    <Stack.Screen name={SCREENS.FAN_CLUB} component={FanClubScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.TABLE_RESERVATION} component={TableReservationScreen} options={{ animation: 'slide_from_bottom' }} />
                    {/* Home Features */}
                    <Stack.Screen name={SCREENS.BOLT_DELIVERY} component={BoltDeliveryScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.NINETY_NINE_STORE} component={NinetyNineStoreScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.FLASH_DEALS} component={FlashDealsScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.GROUP_ORDER} component={GroupOrderScreen} options={{ animation: 'slide_from_bottom' }} />
                    <Stack.Screen name={SCREENS.AI_COMBO} component={AIComboScreen} options={{ animation: 'slide_from_right' }} />
                    {FEATURE_FLAGS.ENABLE_DINING_OUT && (
                        <Stack.Screen name={SCREENS.DINE_IN} component={DineInScreen} options={{ animation: 'slide_from_right' }} />
                    )}
                    <Stack.Screen name={SCREENS.SMART_FILTERS} component={SmartFiltersScreen} options={{ animation: 'slide_from_bottom' }} />
                    {FEATURE_FLAGS.ENABLE_IRCTC_FOOD && (
                        <Stack.Screen name={SCREENS.TRAIN_DELIVERY} component={TrainDeliveryScreen} options={{ animation: 'slide_from_right' }} />
                    )}
                    <Stack.Screen name={SCREENS.QUICK_REORDER} component={QuickReorderScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.FOOD_STORIES} component={FoodStoriesScreen} options={{ animation: 'fade' }} />
                    {/* Tracking */}
                    <Stack.Screen name={SCREENS.TRACKING} component={OrderTrackingScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.RATE_REVIEW} component={RateReviewScreen} options={{ animation: 'slide_from_bottom' }} />
                    {/* Profile */}
                    <Stack.Screen name={SCREENS.HELP_SUPPORT} component={HelpSupportScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.ORDER_CANCELLED} component={OrderCancelledScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.PAYMENTS_HUB} component={PaymentsHubScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.SETTINGS} component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.FAVORITES} component={FavoritesScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.SAVED_ADDRESSES} component={SavedAddressesScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.ORDER_HISTORY} component={OrderHistoryScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.REFERRAL} component={ReferralScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.ORDER_RECEIPT} component={OrderReceiptScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.ECO_DASHBOARD} component={EcoDashboardScreen} options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name={SCREENS.EXPENSE_STATEMENTS} component={ExpenseStatementsScreen} options={{ animation: 'slide_from_right' }} />
                    {/* Errors */}
                    <Stack.Screen name={SCREENS.PAYMENT_FAILED} component={PaymentFailedScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name={SCREENS.GENERIC_ERROR} component={GenericErrorScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name={SCREENS.LOCATION_UNSERVICEABLE} component={LocationUnserviceableScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name={SCREENS.RESTAURANT_CLOSED} component={RestaurantClosedScreen} options={{ animation: 'fade' }} />
                </>
            ) : (
                <Stack.Screen name={STACKS.AUTH} component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
};
