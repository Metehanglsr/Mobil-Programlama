import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TimeSelector({
  duration,
  onIncrease,
  onDecrease,
  onChangeText,
  isLocked,
}) {
  return (
    <View className="flex-row items-center justify-center space-x-4 mb-6">
      <TouchableOpacity
        onPress={onDecrease}
        disabled={isLocked}
        className={`w-12 h-12 rounded-full bg-gray-200 items-center justify-center ${isLocked ? "opacity-30" : "opacity-100"}`}
      >
        <Ionicons name="remove" size={24} color="#374151" />
      </TouchableOpacity>

      <View className="items-center">
        <Text className="text-gray-500 text-xs font-bold mb-1 uppercase">
          Süre (dk)
        </Text>
        <TextInput
          value={String(duration)}
          onChangeText={onChangeText}
          keyboardType="numeric"
          editable={!isLocked}
          className={`w-20 h-12 bg-gray-100 rounded-xl text-center text-xl font-bold text-gray-800 border ${isLocked ? "border-gray-200 text-gray-400" : "border-gray-300"}`}
        />
      </View>

      <TouchableOpacity
        onPress={onIncrease}
        disabled={isLocked}
        className={`w-12 h-12 rounded-full bg-gray-200 items-center justify-center ${isLocked ? "opacity-30" : "opacity-100"}`}
      >
        <Ionicons name="add" size={24} color="#374151" />
      </TouchableOpacity>
    </View>
  );
}