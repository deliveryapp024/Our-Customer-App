import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { SCREENS } from '../constants';
import { HomeScreen, FlashDealsScreen, QuickReorderScreen } from '../features/home';
import { ProfileScreen } from '../features/profile';
import { RestaurantDetailScreen } from '../features/restaurant';

const Tab = createBottomTabNavigator();

// Food Tab Screen - Restaurant Discovery
const FoodScreen = () => (
    <View style={styles.placeholder}>
        <Text style={styles.placeholderEmoji}>🍔</Text>
        <Text style={styles.placeholderText}>Food</Text>
        <Text style={styles.placeholderSubtext}>Discover restaurants and cuisines</Text>
    </View>
);

interface TabIconProps {
    focused: boolean;
    icon: string;
    label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, icon, label }) => (
    <View style={styles.tabIconContainer}>
        <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
);

export const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
            }}>
            <Tab.Screen
                name={SCREENS.HOME_TAB}
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="🏠" label="Home" />
                    ),
                }}
            />
            <Tab.Screen
                name={SCREENS.FOOD_TAB}
                component={FoodScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="🍔" label="Food" />
                    ),
                }}
            />
            <Tab.Screen
                name={SCREENS.REORDER_TAB}
                component={QuickReorderScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="🔄" label="Reorder" />
                    ),
                }}
            />
            <Tab.Screen
                name={SCREENS.DEALS_TAB}
                component={FlashDealsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="🎁" label="Deals" />
                    ),
                }}
            />
            <Tab.Screen
                name={SCREENS.PROFILE_TAB}
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="👤" label="Profile" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#1A1A1A',
        borderTopWidth: 0,
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 22,
        marginBottom: 4,
    },
    tabIconActive: {
        transform: [{ scale: 1.1 }],
    },
    tabLabel: {
        fontSize: 11,
        color: '#6B6B6B',
    },
    tabLabelActive: {
        color: '#00E5FF',
        fontWeight: '600',
    },
    placeholder: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    placeholderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    placeholderSubtext: {
        fontSize: 14,
        color: '#6B6B6B',
    },
});

export default MainTabNavigator;
