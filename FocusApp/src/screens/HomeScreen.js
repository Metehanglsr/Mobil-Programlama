import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TimerDisplay from "../components/home/TimerDisplay";
import CategorySelector from "../components/home/CategorySelector";
import ControlButtons from "../components/home/ControlButtons";
import TimeSelector from "../components/home/TimeSelector";
import { useFocusTimer } from "../hooks/useFocusTimer";

export default function HomeScreen() {
  const {
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
  } = useFocusTimer();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold mb-4 text-gray-800 mt-4">
          Odaklanma Zamanı
        </Text>

        <View className="bg-red-100 px-4 py-2 rounded-lg mb-6">
          <Text className="text-red-600 font-bold">
            Dikkat Dağınıklığı: {distractionCount}
          </Text>
        </View>

        <TimerDisplay isActive={isActive} timeLeft={timeLeft} />

        <TimeSelector
          duration={sessionDuration}
          onIncrease={increaseTime}
          onDecrease={decreaseTime}
          onChangeText={setManualTime}
          isLocked={isActive}
        />

        <Text className="text-lg font-semibold mb-4 self-start text-gray-700 ml-1">
          Kategori Seç
        </Text>

        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          onAdd={addCategory}
          onRemove={removeCategory}
          isLocked={isActive || timeLeft !== sessionDuration * 60}
        />

        <ControlButtons
          isActive={isActive}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          onDebug={debugSetTime}
        />
      </ScrollView>
    </SafeAreaView>
  );
}