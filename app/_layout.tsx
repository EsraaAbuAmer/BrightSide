import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import { GratitudeProvider } from './context/GratitudeContext';
import TabsNavigator from '../app/navigation/TabsNavigator';
import { ThemeProvider } from '../app/context/ThemeContext'; 
import { NavigationContainer } from '@react-navigation/native';
// Notification configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const configureNotifications = async () => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.warn('Notifications permission not granted!');
      }
    }
  } catch (error) {
    console.error('Error configuring notifications:', error);
  }
};

export default function Layout() {
  useEffect(() => {
    configureNotifications();
  }, []);

  return (
    <ThemeProvider>
    <GratitudeProvider>
      <NavigationContainer>
        <TabsNavigator />
      </NavigationContainer>
    </GratitudeProvider>
    </ThemeProvider>
  );
}