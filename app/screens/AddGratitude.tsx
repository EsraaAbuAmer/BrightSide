import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { useGratitude } from '../context/GratitudeContext';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type AddGratitudeProps = {
  navigation: any;
};

const AddGratitude: React.FC<AddGratitudeProps> = ({ navigation }) => {
  const [gratitudeText, setGratitudeText] = useState<string>("I'm grateful for ");
  const { addGratitude } = useGratitude();
  const { isDarkMode } = useTheme(); // Access the theme state

  const allSuggestions = [
    "the sunshine today",
    "a delicious meal",
    "spending time with family",
    "good health",
    "a productive day",
    "the support of friends",
    "a good night's sleep",
    "a fun workout",
    "learning something new",
    "kindness from others",
    "my favorite book",
    "the smell of rain",
    "a relaxing evening",
    "small acts of kindness",
    "a moment of peace",
    "a successful project",
    "a great conversation",
    "having a warm home",
    "clean water to drink",
    "the beauty of nature",
  ];

  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Randomly pick 5 suggestions each time the component mounts
    const randomSuggestions = allSuggestions
      .sort(() => Math.random() - 0.5) // Shuffle the array
      .slice(0, 5);
    setSuggestions(randomSuggestions);
  }, []);

  const handleAddGratitude = () => {
    if (!gratitudeText.trim()) {
      Alert.alert('Error', 'Please enter some text.');
      return;
    }
    addGratitude(gratitudeText);
    setGratitudeText('');
    navigation.goBack();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setGratitudeText((prevText) => {
      // Append suggestion directly without additional spacing
      const trimmedPrevText = prevText.trim();
      return trimmedPrevText.endsWith(' ')
        ? `${trimmedPrevText}${suggestion}`
        : `${trimmedPrevText} ${suggestion}`;
    });
  };

  // Define dynamic theme styles
  const themeStyles = isDarkMode
    ? {
        container: { backgroundColor: '#37474F' },
        textColor: { color: '#ECEFF1' },
        inputBackground: { backgroundColor: '#455A64', borderColor: '#607D8B' },
        suggestionBackground: { backgroundColor: '#607D8B' },
        buttonBackground: { backgroundColor: '#90CAF9' },
      }
    : {
        container: { backgroundColor: '#F8F9FA' },
        textColor: { color: '#37474F' },
        inputBackground: { backgroundColor: '#FFFFFF', borderColor: '#90A4AE' },
        suggestionBackground: { backgroundColor: '#ECEFF1' },
        buttonBackground: { backgroundColor: '#6BB5C9' },
      };

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={isDarkMode ? '#ECEFF1' : '#37474F'} />
        </TouchableOpacity>
        <Text style={[styles.title, themeStyles.textColor]}>Gratitude Journal</Text>
      </View>

      {/* Text Input */}
      <TextInput
        style={[isDarkMode ?styles.textInputDark:styles.textInput, themeStyles.inputBackground]}
        placeholderTextColor={isDarkMode ? '#B0BEC5' : '#90A4AE'}
        value={gratitudeText}
        onChangeText={setGratitudeText}
        multiline
        numberOfLines={5}
      />

      {/* Suggestions */}
      <Text style={[styles.suggestionTitle, themeStyles.textColor]}>Suggestions:</Text>

      <View style={styles.suggestionsWrapper}>
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.suggestionItem, themeStyles.suggestionBackground]}
              onPress={() => handleSuggestionPress(item)}
            >
              <Text style={[styles.suggestionText, themeStyles.textColor]}>{item}</Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsContainer}
        />
      </View>

      {/* Button */}
      <TouchableOpacity style={[styles.buttonContainer, themeStyles.buttonBackground]} onPress={handleAddGratitude}>
        <Text style={[styles.buttonText]}>{isDarkMode ? 'Add Gratitude' : 'Add Gratitude'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '19%',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 16,
    height: '30%',
  },
  textInputDark: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 16,
    height: '30%',
    color:"white",
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  suggestionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionItem: {
    borderRadius: 15,
    padding: 8,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  suggestionsWrapper: {
    height: '10%',
  },
  buttonContainer: {
    width: '40%',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default AddGratitude;