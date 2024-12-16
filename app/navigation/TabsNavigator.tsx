import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native'; // Automatically detects the system's theme
import MainScreen from '../screens/MainScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddGratitude from '../screens/AddGratitude';
import MiniArticles from '../screens/MiniArticles';
import { useTheme } from '../context/ThemeContext';

import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack for MainScreen and related screens
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ headerShown: false }} // Hide header for MainScreen
      />
      <Stack.Screen
        name="AddGratitude"
        component={AddGratitude}
        options={{
          headerShown: false,
          presentation: 'modal', // Optional: Modal presentation for AddGratitude
        }}
      />
    </Stack.Navigator>
  );
};

const TabsNavigator = () => {
  const systemTheme = useColorScheme(); // Automatically detects system light/dark mode
  const { isDarkMode } = useTheme();

  const themeStyles = isDarkMode
    ? {
        tabBarBackground: '#37474F', // Dark gray background for dark mode
        tabBarActiveColor: '#BBDEFB', // Light blue for active tab
        tabBarInactiveColor: '#90A4AE', // Cool gray for inactive tab
        tabBarBorder: '#455A64', // Subtle border for dark mode
      }
    : {
        tabBarBackground: '#F8F9FA', // Light gray for light mode
        tabBarActiveColor: '#6BB5C9', // Soft blue for active tab
        tabBarInactiveColor: 'gray', // Gray for inactive tab
        tabBarBorder: '#ECEFF1', // Subtle border for light mode
      };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Articles') {
            iconName = 'book';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeStyles.tabBarActiveColor,
        tabBarInactiveTintColor: themeStyles.tabBarInactiveColor,
        tabBarStyle: {
          backgroundColor: themeStyles.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: themeStyles.tabBarBorder,
        },
        headerShown: false, // Hides the header for all tabs
      })}
    >
      <Tab.Screen name="Home" component={MainStack} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Articles" component={MiniArticles} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabsNavigator;