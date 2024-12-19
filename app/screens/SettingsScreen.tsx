import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useGratitude } from '../context/GratitudeContext';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

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

  const saveState = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      Alert.alert('Error', `Failed to save ${key} state.`);
    }
  };

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

  const themeStyles = isDarkMode
    ? {
        container: { backgroundColor: '#37474F' },
        title: { color: '#FFFFFF' },
        label: { color: '#FFFFFF' },
        divider: { backgroundColor: '#444' },
      }
    : {
        container: { backgroundColor: '#FFFFFF' },
        title: { color: '#000000' },
        label: { color: '#000000' },
        divider: { backgroundColor: '#EEE' },
      };

  const renderSwitchRow = (label: string, iconName: string, value: boolean, onValueChange: () => void) => (
    <View style={styles.row}>
      <View style={styles.rowContent}>
        <MaterialIcons name={iconName} size={24} color={themeStyles.label.color} />
        <Text style={[styles.label, themeStyles.label]}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#CCC', true: '#6BB5C9' }}
        thumbColor={value ? '#BBDEFB' : '#ECEFF1'}
      />
    </View>
  );

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.title]}>Settings</Text>
      {renderSwitchRow('Daily Reminders', 'notifications', isDailyReminderOn, toggleDailyReminders)}
      <View style={[styles.divider, themeStyles.divider]} />
      {renderSwitchRow('Evening Summary', 'event-note', isEveningSummaryOn, toggleEveningSummary)}
      <View style={[styles.divider, themeStyles.divider]} />
      {renderSwitchRow('Dark Mode', 'brightness-6', isDarkMode, toggleDarkMode)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    marginTop:"25%",
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});

export default SettingsScreen;