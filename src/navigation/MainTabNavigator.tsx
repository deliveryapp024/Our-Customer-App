import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { House, ForkKnife, ArrowCounterClockwise, Gift, User } from 'phosphor-react-native';
import { FEATURE_FLAGS, SCREENS } from '../constants';
import { HomeScreen, FlashDealsScreen, QuickReorderScreen, FoodScreen } from '../features/home';
import { ProfileScreen } from '../features/profile';

const Tab = createBottomTabNavigator();

interface TabIconProps {
    focused: boolean;
    IconComponent: React.ComponentType<any>;
    label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, IconComponent, label }) => (
    <View style={styles.tabIconContainer}>
        <IconComponent 
            size={22} 
            color={focused ? '#00E5FF' : '#6B6B6B'} 
            weight={focused ? 'fill' : 'regular'}
        />
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
                        <TabIcon focused={focused} IconComponent={House} label="Home" />
                    ),
                }}
            />
            <Tab.Screen
                name={SCREENS.FOOD_TAB}
                component={FoodScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} IconComponent={ForkKnife} label="Food" />
                    ),
                }}
            />
            {FEATURE_FLAGS.ENABLE_QUICK_REORDER && (
                <Tab.Screen
                    name={SCREENS.REORDER_TAB}
                    component={QuickReorderScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} IconComponent={ArrowCounterClockwise} label="Reorder" />
                        ),
                    }}
                />
            )}
            {FEATURE_FLAGS.ENABLE_FLASH_DEALS && (
                <Tab.Screen
                    name={SCREENS.DEALS_TAB}
                    component={FlashDealsScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} IconComponent={Gift} label="Deals" />
                        ),
                    }}
                />
            )}
            <Tab.Screen
                name={SCREENS.PROFILE_TAB}
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} IconComponent={User} label="Profile" />
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
    tabLabel: {
        fontSize: 11,
        color: '#6B6B6B',
        marginTop: 4,
    },
    tabLabelActive: {
        color: '#00E5FF',
        fontWeight: '600',
    },
});

export default MainTabNavigator;
