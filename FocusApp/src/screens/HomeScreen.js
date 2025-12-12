import React from "react";
import { View, Text } from "react-native";
import TimerDisplay from "../components/home/TimerDisplay";
import CategorySelector from "../components/home/CategorySelector";
import ControlButtons from "../components/home/ControlButtons";
import { useFocusTimer } from "../hooks/useFocusTimer";

export default function HomeScreen() {
  const {
    timeLeft,
    isActive,
    distractionCount,
    selectedCategory,
    setSelectedCategory,
    startTimer,
    pauseTimer,
    resetTimer,
    debugSetTime,
  } = useFocusTimer();

  const categories = ["Ders Çalışma", "Kodlama", "Proje", "Kitap Okuma"];

  return (
    <View className="flex-1 bg-white items-center pt-16 px-5">
      <Text className="text-3xl font-bold mb-4 text-gray-800">
        Odaklanma Zamanı
      </Text>

      <View className="bg-red-100 px-4 py-2 rounded-lg mb-6">
        <Text className="text-red-600 font-bold">
          Dikkat Dağınıklığı: {distractionCount}
        </Text>
      </View>

      <TimerDisplay isActive={isActive} timeLeft={timeLeft} />

      <Text className="text-lg font-semibold mb-4 self-start text-gray-700 ml-1">
        Kategori Seç
      </Text>

      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        isLocked={isActive || timeLeft !== 25 * 60}
      />

      <ControlButtons
        isActive={isActive}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
        onDebug={debugSetTime}
      />
    </View>
  );
}