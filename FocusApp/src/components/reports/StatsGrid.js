import React from "react";
import { View } from "react-native";
import StatCard from "./StatCard";

export default function StatsGrid({ stats }) {
  return (
    <View className="flex-row flex-wrap justify-between mb-6">
      <StatCard title="Bugün" value={stats.todayFocus} unit="dk" color="blue" />
      <StatCard
        title="Toplam"
        value={stats.totalFocus}
        unit="dk"
        color="purple"
      />
      <StatCard
        title="Dağınıklık"
        value={stats.totalDistractions}
        unit="kez"
        color="red"
      />
      <StatCard
        title="Seanslar"
        value={stats.sessionCount}
        unit="adet"
        color="green"
      />
    </View>
  );
}