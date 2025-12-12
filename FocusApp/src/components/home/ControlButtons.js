import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function ControlButtons({
  isActive,
  onStart,
  onPause,
  onReset,
  onDebug,
}) {
  return (
    <View className="flex-row justify-between w-full px-4">
      {!isActive ? (
        <TouchableOpacity
          onPress={onStart}
          className="flex-1 bg-green-500 py-4 rounded-full shadow-lg mr-2 items-center"
        >
          <Text className="text-white text-xl font-bold">BAŞLAT</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPause}
          className="flex-1 bg-yellow-500 py-4 rounded-full shadow-lg mr-2 items-center"
        >
          <Text className="text-white text-xl font-bold">DURAKLAT</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onReset}
        onLongPress={onDebug}
        className="bg-gray-200 py-4 px-6 rounded-full items-center ml-2"
      >
        <Text className="text-gray-600 text-xl font-bold">SIFIRLA</Text>
      </TouchableOpacity>
    </View>
  );
}