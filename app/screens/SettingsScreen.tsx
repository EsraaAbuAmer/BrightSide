import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useGratitude } from '../context/GratitudeContext';
import { useTheme } from '../context/ThemeContext';


type SettingsScreenProps = {
  navigation: any;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const {
    activateDailyReminders,
    stopDailyReminders,
    activateEveningSummary,
    stopEveningSummary,
  } = useGratitude();

  const [isDailyReminderOn, setIsDailyReminderOn] = useState(false);
  const [isEveningSummaryOn, setIsEveningSummaryOn] = useState(false);

  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  // Initialize Settings
  useEffect(() => {
    const initializeSettings = async () => {
      try {
        const dailyReminderState = await AsyncStorage.getItem('isDailyReminderOn');
        const eveningSummaryState = await AsyncStorage.getItem('isEveningSummaryOn');
        const darkModeState = await AsyncStorage.getItem('isDarkMode');
        const { status } = await Notifications.getPermissionsAsync();

        setHasNotificationPermission(status === 'granted');
        setIsDailyReminderOn(dailyReminderState === 'true');
        setIsEveningSummaryOn(eveningSummaryState === 'true');

      } catch (error) {
        console.error('Failed to initialize settings:', error);
      }
    };

    initializeSettings();
  }, []);

  // Save State in AsyncStorage
  const saveState = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      Alert.alert('Error', `Failed to save ${key} state.`);
    }
  };

  // Request Notification Permission
  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setHasNotificationPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'To activate notifications, please enable notifications in your device settings.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request notification permissions.');
    }
  };

  // Toggle Daily Reminders
  const toggleDailyReminders = async () => {
    if (!hasNotificationPermission) {
      await requestNotificationPermission();
    }

    if (hasNotificationPermission) {
      try {
        if (!isDailyReminderOn) {
          await activateDailyReminders();
          Alert.alert('Daily Reminders Activated', 'You will receive reminders at 12 PM and 6 PM.');
        } else {
          await stopDailyReminders();
          Alert.alert('Daily Reminders Stopped', 'No more daily reminders will be sent.');
        }
        setIsDailyReminderOn((prevState) => {
          saveState('isDailyReminderOn', !prevState);
          return !prevState;
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to toggle daily reminders.');
      }
    }
  };

  // Toggle Evening Summary
  const toggleEveningSummary = async () => {
    if (!hasNotificationPermission) {
      await requestNotificationPermission();
    }

    if (hasNotificationPermission) {
      try {
        if (!isEveningSummaryOn) {
          await activateEveningSummary();
          Alert.alert('Evening Summary Activated', 'You will receive a summary at 9 PM.');
        } else {
          await stopEveningSummary();
          Alert.alert('Evening Summary Stopped', 'No more evening summaries will be sent.');
        }
        setIsEveningSummaryOn((prevState) => {
          saveState('isEveningSummaryOn', !prevState);
          return !prevState;
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to toggle evening summary.');
      }
    }
  };

  // Dynamic Theme Styles
  const themeStyles = isDarkMode
    ? {
        container: { backgroundColor: '#37474F' }, // Dark background
        title: { color: '#FFFFFF' }, // Light text
        label: { color: '#ECEFF1' }, // Light gray for labels
        borderColor: '#6BB5C9', // Highlight blue for borders
      }
    : {
        container: { backgroundColor: '#F8F9FA' }, // Light gray background
        title: { color: '#37474F' }, // Dark gray text
        label: { color: '#37474F' }, // Dark gray for labels
        borderColor: '#90A4AE', // Cool gray for borders
      };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.title]}>Settings</Text>

      <View style={[styles.switchContainer, { borderColor: themeStyles.borderColor }]}>
        <Text style={[styles.label, themeStyles.label]}>Daily Reminders</Text>
        <Switch
          value={isDailyReminderOn}
          onValueChange={toggleDailyReminders}
          trackColor={{ false: '#90A4AE', true: '#6BB5C9' }}
          thumbColor={isDailyReminderOn ? '#BBDEFB' : '#ECEFF1'}
        />
      </View>

      <View style={[styles.switchContainer, { borderColor: themeStyles.borderColor }]}>
        <Text style={[styles.label, themeStyles.label]}>Evening Summary</Text>
        <Switch
          value={isEveningSummaryOn}
          onValueChange={toggleEveningSummary}
          trackColor={{ false: '#90A4AE', true: '#6BB5C9' }}
          thumbColor={isEveningSummaryOn ? '#BBDEFB' : '#ECEFF1'}
        />
      </View>

      <View style={[styles.switchContainer, { borderColor: themeStyles.borderColor }]}>
        <Text style={[styles.label, themeStyles.label]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#90A4AE', true: '#6BB5C9' }}
          thumbColor={isDarkMode ? '#BBDEFB' : '#ECEFF1'}
        />
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: "25%",
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;