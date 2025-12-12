import React from "react";
import { View, Text } from "react-native";

export default function StatCard({ title, value, unit, color }) {
  const borderColors = {
    blue: "border-blue-500",
    purple: "border-purple-500",
    red: "border-red-500",
    green: "border-green-500",
  };

  const borderColorClass = borderColors[color] || "border-gray-500";

  return (
    <View
      className={`w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4 border-l-4 ${borderColorClass}`}
    >
      <Text className="text-gray-500 text-xs font-bold uppercase mb-1">
        {title}
      </Text>
      <Text className="text-2xl font-bold text-gray-800">
        {value}{" "}
        <Text className="text-sm font-normal text-gray-500">{unit}</Text>
      </Text>
    </View>
  );
}