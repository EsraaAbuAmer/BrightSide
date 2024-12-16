import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native'; // Detects system theme
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type GratitudeCardProps = {
  item: any;
  deleteGratitude: (id: string) => void;
};

const GratitudeCard: React.FC<GratitudeCardProps> = ({ item, deleteGratitude }) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.gratitudeItem, isDarkMode && styles.gratitudeItemDark]}>
      {/* Gratitude Text and Time */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.text, isDarkMode && styles.textDark]}>{item?.text}</Text>
        <Text style={[styles.date, isDarkMode && styles.dateDark]}>
          {new Date(item?.date).toLocaleTimeString()}
        </Text>
      </View>

      {/* Delete Icon */}
      <TouchableOpacity onPress={() => deleteGratitude(item?.id)}>
        <Icon name="trash" size={20} color={isDarkMode ? '#90CAF9' : '#6BB5C9'} />
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  gratitudeItem: {
    marginTop: 10,
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // Light mode: White background for cards
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row', // Keeps items in a horizontal row
    justifyContent: 'space-between', // Space between text and icon
    alignItems: 'center', // Centers items vertically
  },
  gratitudeItemDark: {
    backgroundColor: '#455A64', // Dark mode: Dark gray background for cards
    shadowColor: '#000',
  },
  text: {
    fontSize: 16,
    color: '#37474F', // Light mode: Dark gray for text
  },
  textDark: {
    color: '#ECEFF1', // Dark mode: Light gray for text
  },
  date: {
    fontSize: 12,
    color: '#90A4AE', // Light mode: Cool gray for the timestamp
    marginTop: 4,
  },
  dateDark: {
    color: '#B0BEC5', // Dark mode: Lighter gray for the timestamp
  },
});

export default GratitudeCard;