import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';

import { GratitudeProvider } from './context/GratitudeContext';
import TabsNavigator from '../app/navigation/TabsNavigator';
import { ThemeProvider } from '../app/context/ThemeContext';
import SplashScreenComponent from './screens/SplashScreen';


SplashScreen.preventAutoHideAsync();

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
      }
    }
  } catch (error) {
  }
};

export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await configureNotifications();
        await new Promise(resolve => setTimeout(resolve, 3000)); // Delay for splash screen
      
      } catch (e) {
      } finally {
        setAppIsReady(true); // Start animation when app is ready
      }
    }

    prepare();
  }, []);

  const handleSplashFinish = () => {
    setIsAnimationComplete(true); // Transition to the main app
  };

  if (!appIsReady || !isAnimationComplete) {
    return <SplashScreenComponent onFinish={handleSplashFinish} delayBeforeAnimation={1500} />;
  }

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