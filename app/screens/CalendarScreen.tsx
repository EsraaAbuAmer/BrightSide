import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Agenda } from 'react-native-calendars';
import { useGratitude } from '../context/GratitudeContext';

interface AgendaItems {
  [date: string]: { text: string; id: string }[];
}

const CalendarScreen: React.FC = () => {
  const { gratitudes, deleteGratitude } = useGratitude();
  const [items, setItems] = useState<AgendaItems>({});
  const { isDarkMode } = useTheme(); // Access theme state
  
  useEffect(() => {
    const groupedGratitudes = gratitudes.reduce((acc: AgendaItems, gratitude) => {
      const dateKey = gratitude.date.split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push({ text: gratitude.text, id: gratitude.id });
      return acc;
    }, {});
    setItems(groupedGratitudes);
  }, [gratitudes]);

  const renderItem = (item: { text: string; id: string }) => (
    <View style={[styles.item, isDarkMode && styles.itemDark]}>
      <Text style={[styles.itemText, isDarkMode && styles.itemTextDark]}>{item.text}</Text>
      <TouchableOpacity onPress={() => deleteGratitude(item.id)}  style={[styles.deleteButton]}>
        <Text style={[styles.deleteText, isDarkMode && styles.deleteTextDark]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyData = () => (
    <View style={[styles.emptyContainer, isDarkMode && styles.emptyContainerDark]}>
      <Text style={[styles.emptyText, isDarkMode && styles.emptyTextDark]}>No gratitude entries for this day!</Text>
      <Text style={[styles.suggestionText, isDarkMode && styles.suggestionTextDark]}>
        Take a moment to reflect on what you're grateful for and start adding entries.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, isDarkMode && styles.safeContainerDark]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#37474F' : '#F8F9FA'}
      />
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <Agenda
        key={isDarkMode ? 'dark' : 'light'} 
          items={items}
          selected={new Date().toISOString().split('T')[0]}
          renderItem={renderItem}
          renderEmptyData={renderEmptyData}
          theme={{
            agendaKnobColor: isDarkMode ? '#90CAF9' : '#6BB5C9',
            reservationsBackgroundColor: isDarkMode ? '#37474F' : '#F8F9FA', // Agenda background
            calendarBackground: isDarkMode ? '#37474F' : '#F8F9FA', // Calendar background
            textSectionTitleColor: isDarkMode ? '#BBDEFB' : '#37474F',
            selectedDayBackgroundColor: isDarkMode ? '#90CAF9' : '#6BB5C9',
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: isDarkMode ? '#90CAF9' : '#6BB5C9',
            dayTextColor: isDarkMode ? '#ECEFF1' : '#37474F',
            textDisabledColor: isDarkMode ? '#607D8B' : '#90A4AE',
            dotColor: isDarkMode ? '#90CAF9' : '#6BB5C9',
            selectedDotColor: '#FFFFFF',
            monthTextColor: isDarkMode ? '#BBDEFB' : '#37474F',
            indicatorColor: isDarkMode ? '#90CAF9' : '#6BB5C9',
            agendaDayTextColor: isDarkMode ? '#BBDEFB' : '#37474F',
            agendaDayNumColor: isDarkMode ? '#BBDEFB' : '#37474F',
            agendaTodayColor: isDarkMode ? '#90CAF9' : '#6BB5C9',
            agendaKnobIconColor: isDarkMode ? '#90CAF9' : '#6BB5C9',
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeContainerDark: {
    backgroundColor: '#37474F',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  containerDark: {
    backgroundColor: '#37474F',
  },
  item: {
    backgroundColor: '#ECEFF1',
    borderRadius: 8,
    padding: 16,
    marginRight: 10,
    marginTop: 17,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemDark: {
    backgroundColor: '#455A64',
    shadowColor: '#000',
  },
  itemText: {
    color: '#37474F',
    fontSize: 16,
  },
  itemTextDark: {
    color: '#ECEFF1',
  },
  deleteText: {
    color: '#6BB5C9',
    fontSize: 14,
  },
  deleteTextDark: {
    color: '#90CAF9',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
  },
  emptyContainerDark: {
    backgroundColor: '#37474F',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#37474F',
    marginBottom: 10,
  },
  emptyTextDark: {
    color: '#ECEFF1',
  },
  suggestionText: {
    fontSize: 16,
    color: '#90A4AE',
    textAlign: 'center',
  },
  suggestionTextDark: {
    color: '#607D8B',
  },
  deleteButton:{
    width:"20%",
    marginTop:5,
  }
});

export default CalendarScreen;