import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@focus_sessions";
const CATEGORIES_KEY = "@categories";

const DEFAULT_CATEGORIES = ["Ders Çalışma", "Kodlama", "Proje", "Kitap Okuma"];

export const saveFocusSession = async (session) => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const sessions = existingData ? JSON.parse(existingData) : [];
    sessions.push(session);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error(e);
  }
};

export const getFocusSessions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const clearAllSessions = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
};

export const getCategories = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CATEGORIES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_CATEGORIES;
  } catch (e) {
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = async (categories) => {
  try {
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error(e);
  }
};
