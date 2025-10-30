// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
// Import your translation files
import en from './languages/en.json';
import ar from './languages/ar.json';

export const getCurrentLanguage = () => i18n.language;

export let selectedLanguage = '';
// const lan = Platform.OS == 'ios'?"ar":"en"
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      const savedLang = await AsyncStorage.getItem('user-language');
      const deviceLang = Localization.locale.split('-')[0]; // e.g., "en-US" → "en"
      const lang = savedLang || deviceLang || 'en';
      selectedLanguage = lang;
      callback(lang);
    } catch (err) {
      console.error('Language detection error:', err);
      callback('en'); // fallback
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng) => {
    try {
      await AsyncStorage.setItem('user-language', lng);
    } catch (err) {
      console.error('Failed to cache language:', err);
    }
  },
};

export const switchLanguage = async () => {
  try {
    const current = await AsyncStorage.getItem('user-language');
    const nextLang = current === 'ar' ? 'en' : 'ar';
    await AsyncStorage.setItem('user-language', nextLang);
    selectedLanguage = nextLang;
    await i18n.changeLanguage(nextLang);
  } catch (err) {
    console.error('Error switching language:', err);
  }
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // important for React Native
    },
  });

export default i18n;