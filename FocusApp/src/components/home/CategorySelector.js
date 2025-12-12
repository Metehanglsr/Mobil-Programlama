import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function CategorySelector({
  categories,
  selectedCategory,
  onSelect,
  isLocked,
}) {
  return (
    <View className="flex-row flex-wrap justify-between w-full mb-8">
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onSelect(category)}
          disabled={isLocked}
          className={`w-[48%] py-4 rounded-xl items-center mb-3 border ${
            selectedCategory === category
              ? "bg-red-50 border-red-500"
              : "bg-gray-100 border-transparent"
          } ${isLocked ? "opacity-40" : "opacity-100"}`}
        >
          <Text
            className={`text-base font-medium ${
              selectedCategory === category
                ? "text-red-500 font-bold"
                : "text-gray-600"
            }`}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}