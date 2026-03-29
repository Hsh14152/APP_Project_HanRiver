import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from './constants/colors';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import BookmarkScreen from './screens/BookmarkScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: '홈', icon: '🏠', component: HomeScreen },
  { name: '지도', icon: '🗺️', component: MapScreen },
  { name: '즐겨찾기', icon: '⭐', component: BookmarkScreen },
  { name: '정보', icon: 'ℹ️', component: SettingsScreen },
];

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            const tab = TABS.find((t) => t.name === route.name);
            return (
              <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
                {tab.icon}
              </Text>
            );
          },
          tabBarActiveTintColor: COLORS.brand,
          tabBarInactiveTintColor: '#999',
          headerStyle: { backgroundColor: COLORS.brand },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      >
        {TABS.map((tab) => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
