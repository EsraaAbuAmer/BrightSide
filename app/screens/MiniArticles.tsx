import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'The Power of Gratitude',
    summary: 'Discover how gratitude can transform your mindset and daily life.',
    content:
      'Gratitude helps you focus on the positive aspects of life. Start small—write down three things you’re thankful for each day. Over time, you’ll see a shift in your perspective and a greater sense of joy.',
  },
  {
    id: '2',
    title: 'Finding Hope in Tough Times',
    summary: 'Practical tips to stay hopeful when life feels overwhelming.',
    content:
      'When faced with challenges, take a moment to breathe. Remember, tough times don’t last forever. Engage in activities you love, lean on your support system, and remind yourself of past challenges you’ve overcome.',
  },
  {
    id: '3',
    title: 'Mindfulness and Happiness',
    summary: 'Learn how mindfulness practices can enhance your happiness.',
    content:
      'Mindfulness involves being present in the moment. Try a 5-minute breathing exercise or focus on the sensations around you. Over time, mindfulness helps reduce stress and increases feelings of contentment.',
  },
];

const MiniArticles = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { isDarkMode } = useTheme();

  // Dynamic styles based on theme
  const themeStyles = isDarkMode
    ? {
        container: { backgroundColor: '#37474F' },
        text: { color: '#ECEFF1' },
        cardBackground: { backgroundColor: '#455A64' },
        detailBackground: { backgroundColor: '#37474F' },
        buttonBackground: { backgroundColor: '#90CAF9' },
        buttonText: { color: '#37474F' },
      }
    : {
        container: { backgroundColor: '#F8F9FA' },
        text: { color: '#37474F' },
        cardBackground: { backgroundColor: '#ECEFF1' },
        detailBackground: { backgroundColor: '#FFFFFF' },
        buttonBackground: { backgroundColor: '#6BB5C9' },
        buttonText: { color: '#FFFFFF' },
      };

  const renderArticle = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={[styles.articleCard, themeStyles.cardBackground]}
      onPress={() => setSelectedArticle(item)}
    >
      <Text style={[styles.articleTitle, themeStyles.text]}>{item.title}</Text>
      <Text style={[styles.articleSummary]}>{item.summary}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, themeStyles.container]}>
      {selectedArticle ? (
        <ScrollView style={[styles.articleDetailContainer, themeStyles.detailBackground]}>
          <Text style={[styles.articleTitle, themeStyles.text]}>
            {selectedArticle.title}
          </Text>
          <Text style={[styles.articleContent, themeStyles.text]}>
            {selectedArticle.content}
          </Text>
          <TouchableOpacity
            style={[styles.backButton, themeStyles.buttonBackground]}
            onPress={() => setSelectedArticle(null)}
          >
            <Text style={[styles.buttonText, themeStyles.buttonText]}>Back to Articles</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          <Text style={[styles.header, themeStyles.text]}>Articles</Text>
          <FlatList
            data={articles}
            keyExtractor={(item) => item.id}
            renderItem={renderArticle}
            contentContainerStyle={styles.articleList}
          />
        </>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: '25%',
  },
  articleList: {
    paddingBottom: 20,
  },
  articleCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#37474F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  articleSummary: {
    fontSize: 14,
    color: '#6BB5C9',
  },
  articleDetailContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: '25%',
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  backButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MiniArticles;