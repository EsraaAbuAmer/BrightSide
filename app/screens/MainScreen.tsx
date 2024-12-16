import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { useGratitude } from '../context/GratitudeContext';
import GraditudeCard from '../components/GraditudeCard';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
type MainScreenProps = {
  navigation: any; // Add specific types if using React Navigation
};

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const { gratitudes, deleteGratitude } = useGratitude();

  // State for dark mode
  const { isDarkMode } = useTheme();

  // Get today's date as a string (e.g., "2024-11-24")
  const todayDate = new Date().toISOString().split('T')[0];

  // Filter gratitudes for today
  const todaysGratitudes = gratitudes.filter((item) => item.date.startsWith(todayDate));



  const handlePlusClick = () => {
    navigation.navigate('AddGratitude');
  };

  const themeStyles = isDarkMode
    ? {
        container: { backgroundColor: '#37474F' }, // Dark background
        text: { color: '#FFFFFF' }, // White text for dark mode
        separator: { backgroundColor: '#90A4AE' }, // Cool gray for separator
      }
    : {
        container: { backgroundColor: '#F8F9FA' }, // Light gray background
        text: { color: '#37474F' }, // Dark text for light mode
        separator: { backgroundColor: '#ECEFF1' }, // Light gray for separator
      };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themeStyles.container.backgroundColor}
      />
      {/* Header with title and plus icon */}
      <View style={styles.header}>
        <Text style={[styles.title, themeStyles.text]}>Gratitude Journal</Text>
        <TouchableOpacity onPress={handlePlusClick}>
          <Icon name="add" size={30} color={isDarkMode ? '#FFFFFF' : '#000'} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.subHeader, themeStyles.text]}>
        Keep track of the things you're grateful for.
      </Text>

      {/* Gratitudes for Today */}
      {todaysGratitudes.length > 0 ? (
        <FlatList
          data={todaysGratitudes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GraditudeCard item={item} deleteGratitude={deleteGratitude} />
          )}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, themeStyles.separator]} />
          )}
        />
      ) : (
        <Text style={[styles.noGratitudeText, themeStyles.text]}>
          No gratitude's added for today!
        </Text>
      )}
    </View>
  );
};

// Base styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: '25%',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  subHeader: {
    marginBottom: 20,
    fontSize: 16,
  },
  separator: {
    height: 1,
    marginVertical: 8,
  },
  noGratitudeText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MainScreen;