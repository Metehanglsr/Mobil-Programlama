import { useState, useEffect, useRef } from "react";
import { AppState, Alert } from "react-native";
import { saveFocusSession } from "../utils/storage";

export const useFocusTimer = () => {
  const [selectedCategory, setSelectedCategory] = useState("Kodlama");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);

  const appState = useRef(AppState.currentState);
  const isSessionSaved = useRef(false);
  const lastDistractionTime = useRef(0);

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

    return () => {
      subscription.remove();
    };
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
    const sessionData = {
      id: Date.now(),
      category: selectedCategory,
      duration: 25,
      distractions: distractionCount,
      date: new Date().toISOString(),
    };

    await saveFocusSession(sessionData);

    Alert.alert(
      "Tebrikler! 🎉",
      "Seans başarıyla tamamlandı ve kaydedildi. Yeni seans için lütfen SIFIRLA butonuna bas."
    );
  };

  const startTimer = () => {
    if (timeLeft <= 0) {
      Alert.alert(
        "Süre Bitti",
        "Lütfen yeni bir seans için önce SIFIRLA butonuna bas."
      );
      return;
    }
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setDistractionCount(0);
    isSessionSaved.current = false;
  };

  const debugSetTime = () => {
    if (isSessionSaved.current) {
      resetTimer();
    }
    setTimeLeft(5);
  };

  return {
    timeLeft,
    isActive,
    distractionCount,
    selectedCategory,
    setSelectedCategory,
    startTimer,
    pauseTimer,
    resetTimer,
    debugSetTime,
  };
};