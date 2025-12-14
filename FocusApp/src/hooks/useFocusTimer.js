import { useState, useEffect, useRef } from "react";
import { AppState, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import {
  saveFocusSession,
  getCategories,
  saveCategories,
} from "../utils/storage";

export const useFocusTimer = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [sessionDuration, setSessionDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const [isActive, setIsActive] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);

  const appState = useRef(AppState.currentState);
  const isSessionSaved = useRef(false);
  const lastDistractionTime = useRef(0);

  useEffect(() => {
    const loadData = async () => {
      const savedCategories = await getCategories();
      setCategories(savedCategories);
      if (savedCategories.length > 0) {
        setSelectedCategory(savedCategories[0]);
      }
    };
    loadData();
  }, []);

  const updateDuration = (newDuration) => {
    if (isActive) return;
    if (newDuration < 1) newDuration = 1;
    if (newDuration > 180) newDuration = 180;

    setSessionDuration(newDuration);
    setTimeLeft(newDuration * 60);
    isSessionSaved.current = false;
  };

  const increaseTime = () => updateDuration(sessionDuration + 5);
  const decreaseTime = () => updateDuration(sessionDuration - 5);

  const setManualTime = (text) => {
    const number = parseInt(text.replace(/[^0-9]/g, ""));
    if (!isNaN(number)) {
      updateDuration(number);
    } else if (text === "") {
      setSessionDuration(0);
    }
  };

  const addCategory = async (newCategory) => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory)) {
      Alert.alert("Hata", "Bu kategori zaten var!");
      return;
    }
    const updated = [...categories, newCategory];
    setCategories(updated);
    await saveCategories(updated);
    setSelectedCategory(newCategory);
  };

  const removeCategory = async (categoryToRemove) => {
    if (categories.length <= 1) {
      Alert.alert("Hata", "En az bir kategori kalmalı!");
      return;
    }
    Alert.alert("Kategoriyi Sil", `"${categoryToRemove}" silinsin mi?`, [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          const updated = categories.filter((c) => c !== categoryToRemove);
          setCategories(updated);
          await saveCategories(updated);
          if (selectedCategory === categoryToRemove)
            setSelectedCategory(updated[0]);
        },
      },
    ]);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        if (isActive) {
          const now = Date.now();
          if (now - lastDistractionTime.current > 1000) {
            setIsActive(false);
            setDistractionCount((prev) => prev + 1);
            lastDistractionTime.current = now;
          }
        }
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [isActive]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (!isSessionSaved.current) {
        handleSessionComplete();
        isSessionSaved.current = true;
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionComplete = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const sessionData = {
      id: Date.now(),
      category: selectedCategory,
      duration: sessionDuration,
      distractions: distractionCount,
      date: new Date().toISOString(),
    };
    await saveFocusSession(sessionData);
    Alert.alert("Tebrikler! 🎉", "Seans başarıyla tamamlandı.");
  };

  const startTimer = () => {
    if (sessionDuration === 0) {
      updateDuration(25);
      return;
    }
    if (timeLeft <= 0) {
      Alert.alert("Süre Bitti", "Lütfen önce SIFIRLA butonuna bas.");
      return;
    }
    setIsActive(true);
  };

  const pauseTimer = () => setIsActive(false);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionDuration * 60);
    setDistractionCount(0);
    isSessionSaved.current = false;
  };

  const debugSetTime = () => {
    if (isSessionSaved.current) resetTimer();
    setTimeLeft(5);
  };

  return {
    timeLeft,
    isActive,
    distractionCount,
    selectedCategory,
    categories,
    sessionDuration,
    increaseTime,
    decreaseTime,
    setManualTime,
    setSelectedCategory,
    addCategory,
    removeCategory,
    startTimer,
    pauseTimer,
    resetTimer,
    debugSetTime,
  };
};