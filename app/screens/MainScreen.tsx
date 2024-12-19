import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useGratitude } from '../context/GratitudeContext';
import GraditudeCard from '../components/GraditudeCard';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

type MainScreenProps = {
  navigation: any;
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const { gratitudes, deleteGratitude } = useGratitude();
  const { isDarkMode } = useTheme();

  const todayDate = new Date().toISOString().split('T')[0];
  const todaysGratitudes = gratitudes.filter((item) => item.date.startsWith(todayDate));

  const handlePlusClick = () => {
    navigation.navigate('AddGratitude');
  };

  const handleDeleteGratitude = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    deleteGratitude(id);
  };

  const themeStyles = isDarkMode
    ? {
        container: { backgroundColor: '#37474F' },
        text: { color: '#FFFFFF' },
        separator: { backgroundColor: '#90A4AE' },
      }
    : {
        container: { backgroundColor: '#F8F9FA' },
        text: { color: '#37474F' },
        separator: { backgroundColor: '#ECEFF1' },
      };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themeStyles.container.backgroundColor}
      />
      <View style={styles.header}>
        <Text style={[styles.title, themeStyles.text]}>Today's Gratitude Journal</Text>
        <TouchableOpacity onPress={handlePlusClick}>
          <Icon name="add" size={30} color={isDarkMode ? '#FFFFFF' : '#000'} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.subHeader, themeStyles.text]}>
        Keep track of the things you're grateful for.
      </Text>

      {todaysGratitudes.length > 0 ? (
        <FlatList
          data={todaysGratitudes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GraditudeCard
              item={item}
              deleteGratitude={() => handleDeleteGratitude(item.id)}
            />
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