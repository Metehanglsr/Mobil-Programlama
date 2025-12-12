import React from "react";
import { View, Text } from "react-native";
import { formatTime } from "../../utils/helpers";

export default function TimerDisplay({ isActive, timeLeft }) {
  return (
    <View
      className={`items-center mb-8 p-8 rounded-full border-[6px] w-64 h-64 justify-center ${isActive ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
    >
      <Text
        className={`text-6xl font-bold ${isActive ? "text-green-600" : "text-red-500"}`}
      >
        {formatTime(timeLeft)}
      </Text>
      <Text className="text-sm text-gray-500 mt-2 font-medium">
        {isActive ? "Hadi Bakalım, Odaklan!" : "Odaklanmaya Hazır mısın?"}
      </Text>
    </View>
  );
}