import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function ReportsHeader({ onClear }) {
  return (
    <View className="flex-row justify-between items-center mb-6">
      <Text className="text-3xl font-bold text-gray-800">Raporlar</Text>
      <TouchableOpacity
        onPress={onClear}
        className="bg-red-100 px-3 py-1 rounded-lg"
      >
        <Text className="text-red-500 font-bold text-xs">TEMİZLE</Text>
      </TouchableOpacity>
    </View>
  );
}