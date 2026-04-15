import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import AdBanner from '../components/AdBanner';
import { COLORS, SIZES } from '../constants/theme';
import { translateText, translatePlainText } from '../services/translate';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const ArticleScreen = ({ route, navigation }) => {
  const { article } = route.params;
  const { width } = useWindowDimensions();
  const contentWidth = width - SIZES.padding * 2;

  const [isTranslated, setIsTranslated] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');

  const tagsStyles = {
    body: {
      color: COLORS.text,
      fontSize: 16,
      lineHeight: 26,
    },
    p: {
      marginBottom: 12,
    },
    img: {
      borderRadius: 8,
    },
    a: {
      color: COLORS.primary,
      textDecorationLine: 'none',
    },
    h1: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    h2: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
    h3: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: COLORS.primary,
      paddingLeft: 12,
      marginVertical: 12,
      fontStyle: 'italic',
    },
    figure: {
      marginVertical: 12,
    },
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.link}`,
        url: article.link,
      });
    } catch (err) {
      // silently fail
    }
  };

  const handleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    if (translatedTitle && translatedContent) {
      setIsTranslated(true);
      return;
    }

    setTranslating(true);
    try {
      const [tTitle, tContent] = await Promise.all([
        translatePlainText(article.title, 'en', 'ms'),
        translateText(article.content, 'en', 'ms'),
      ]);
      setTranslatedTitle(tTitle);
      setTranslatedContent(tContent);
      setIsTranslated(true);
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setTranslating(false);
    }
  };

  const displayTitle = isTranslated ? translatedTitle : article.title;
  const displayContent = isTranslated ? translatedContent : article.content;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>ARTICLE</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={22} color={COLORS.darkGray} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {article.image && (
          <Image source={{ uri: article.image }} style={styles.heroImage} />
        )}

        <View style={styles.articleContent}>
          <Text style={styles.title}>{displayTitle}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{formatDate(article.date)}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{article.author}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.translateBtn, isTranslated && styles.translateBtnActive]}
              onPress={handleTranslate}
              disabled={translating}
            >
              {translating ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="language"
                    size={16}
                    color={isTranslated ? COLORS.white : COLORS.primary}
                  />
                  <Text style={[styles.translateText, isTranslated && styles.translateTextActive]}>
                    {isTranslated ? 'BM' : 'EN'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <RenderHtml
            contentWidth={contentWidth}
            source={{ html: displayContent }}
            tagsStyles={tagsStyles}
            enableExperimentalMarginCollapsing={true}
          />

          <View style={styles.adContainer}>
            <AdBanner />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: SIZES.paddingSmall,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkGray,
    flex: 1,
    textAlign: 'center',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  articleContent: {
    padding: SIZES.padding,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  translateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 4,
  },
  translateBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  translateText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  translateTextActive: {
    color: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  adContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default ArticleScreen;
