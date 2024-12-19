import React, { useState, useEffect } from 'react';
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

const allArticles: Article[] = [
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
  {
    id: '4',
    title: 'The Benefits of Journaling',
    summary: 'Why keeping a journal can improve your mental health.',
    content:
      'Journaling helps you process emotions and reflect on your thoughts. Spend 10 minutes daily writing about your experiences to gain clarity and find solutions to challenges.',
  },
  {
    id: '5',
    title: 'Daily Affirmations',
    summary: 'How positive affirmations can boost your confidence.',
    content:
      'Daily affirmations are positive statements that challenge negative thoughts. Start your day by repeating affirmations like “I am capable” or “I am enough.”',
  },
  {
    id: '6',
    title: 'The Science of Happiness',
    summary: 'What research says about achieving lasting happiness.',
    content:
      'Studies show that fostering social connections, practicing gratitude, and engaging in hobbies are key contributors to happiness. Small consistent efforts can lead to lasting joy.',
  },
  {
    id: '7',
    title: 'Healthy Habits for Mental Well-being',
    summary: 'Develop habits that promote mental health and resilience.',
    content:
      'Healthy habits like exercising, meditating, and maintaining a balanced diet can improve mental well-being. Start with small, achievable goals to build momentum.',
  },
  {
    id: '8',
    title: 'Overcoming Self-Doubt',
    summary: 'Strategies to silence your inner critic.',
    content:
      'Overcoming self-doubt begins with self-awareness. Challenge negative thoughts by questioning their validity and replacing them with positive affirmations.',
  },
  {
    id: '9',
    title: 'The Role of Kindness in Happiness',
    summary: 'Acts of kindness can significantly enhance your happiness.',
    content:
      'Performing acts of kindness not only helps others but also boosts your own happiness. Start by doing one kind thing for someone each day.',
  },
  {
    id: '10',
    title: 'Building Resilience',
    summary: 'How to bounce back from life’s setbacks.',
    content:
      'Resilience is about adapting and growing stronger from challenges. Focus on your strengths, maintain a positive outlook, and seek support when needed.',
  },
];

const MiniArticles = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [dailyArticles, setDailyArticles] = useState<Article[]>([]);
  const { isDarkMode } = useTheme();

  // Randomly select 3 articles every day
  useEffect(() => {
    const selectRandomArticles = () => {
      const shuffled = [...allArticles].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 3);
    };

    setDailyArticles(selectRandomArticles());
  }, []); // Empty dependency array ensures this runs once per mount

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
            data={dailyArticles}
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