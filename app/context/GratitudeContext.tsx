import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import * as Notifications from 'expo-notifications';

interface Gratitude {
  id: string;
  text: string;
  date: string;
}

interface GratitudeContextProps {
  gratitudes: Gratitude[];
  addGratitude: (text: string) => void;
  deleteGratitude: (id: string) => void;
  clearGratitudes: () => void;
  activateDailyReminders: () => void;
  stopDailyReminders: () => void;
  activateEveningSummary: () => void;
  stopEveningSummary: () => void;
}

const GratitudeContext = createContext<GratitudeContextProps | undefined>(undefined);

export const GratitudeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gratitudes, setGratitudes] = useState<Gratitude[]>([]);

  useEffect(() => {
    const loadGratitudes = async () => {
      const storedGratitudes = await AsyncStorage.getItem('gratitudes');
      if (storedGratitudes) {
        setGratitudes(JSON.parse(storedGratitudes));
      }
    };
    loadGratitudes();
  }, []);

  const saveGratitudes = async (newGratitudes: Gratitude[]) => {
    await AsyncStorage.setItem('gratitudes', JSON.stringify(newGratitudes));
  };

  const addGratitude = (text: string) => {
    const newGratitude: Gratitude = {
      id: uuidv4(),
      text,
      date: new Date().toISOString(),
    };
    const updatedGratitudes = [newGratitude, ...gratitudes];
    setGratitudes(updatedGratitudes);
    saveGratitudes(updatedGratitudes);
  };

  const deleteGratitude = (id: string) => {
    const updatedGratitudes = gratitudes.filter((item) => item.id !== id);
    setGratitudes(updatedGratitudes);
    saveGratitudes(updatedGratitudes);
  };

  const clearGratitudes = () => {
    setGratitudes([]);
    AsyncStorage.removeItem('gratitudes');
  };

  const hasGratitudesForToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return gratitudes.some((gratitude) => gratitude.date.startsWith(today));
  };

  const scheduleNotification = async (title: string, body: string, hour: number) => {
    const trigger = new Date();
    trigger.setHours(hour);
    trigger.setMinutes(0);
    trigger.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger,
    });
  };

  const activateDailyReminders = async () => {
    if (!hasGratitudesForToday()) {
      await scheduleNotification(
        'Gratitude Reminder',
        'Take a moment to note what you’re grateful for today.',
        12
      );
      await scheduleNotification(
        'Gratitude Reminder',
        'Have you added something you’re grateful for? Don’t forget!',
        18
      );
    }
  };

  const stopDailyReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const activateEveningSummary = async () => {
    if (hasGratitudesForToday()) {
      const todayGratitudes = gratitudes
        .filter((gratitude) => gratitude.date.startsWith(new Date().toISOString().split('T')[0]))
        .map((g) => g.text)
        .join(', ');

      const summary = `Today, you were grateful for: ${todayGratitudes}`;
      await scheduleNotification('Gratitude Summary', summary, 21);
    }
  };

  const stopEveningSummary = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    checkPermissions();
  }, []);

  return (
    <GratitudeContext.Provider
      value={{
        gratitudes,
        addGratitude,
        deleteGratitude,
        clearGratitudes,
        activateDailyReminders,
        stopDailyReminders,
        activateEveningSummary,
        stopEveningSummary,
      }}
    >
      {children}
    </GratitudeContext.Provider>
  );
};

export const useGratitude = (): GratitudeContextProps => {
  const context = useContext(GratitudeContext);
  if (!context) {
    throw new Error('useGratitude must be used within a GratitudeProvider');
  }
  return context;
};