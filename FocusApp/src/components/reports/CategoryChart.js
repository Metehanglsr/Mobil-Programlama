import React from "react";
import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function CategoryChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <View>
      <Text className="text-lg font-bold text-gray-700 mb-3 ml-1">
        Kategori Dağılımı
      </Text>
      <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 items-center">
        <PieChart
          data={data}
          width={screenWidth - 60}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      </View>
    </View>
  );
}