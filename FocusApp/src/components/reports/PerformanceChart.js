import React from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function PerformanceChart({ data }) {
  return (
    <View>
      <Text className="text-lg font-bold text-gray-700 mb-3 ml-1">
        Son 7 Günlük Performans
      </Text>
      <View className="items-center bg-white rounded-2xl p-2 mb-8 shadow-sm overflow-hidden">
        <BarChart
          data={data}
          width={screenWidth - 60}
          height={220}
          yAxisSuffix=" dk"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{ borderRadius: 16 }}
          showValuesOnTopOfBars
        />
      </View>
    </View>
  );
}