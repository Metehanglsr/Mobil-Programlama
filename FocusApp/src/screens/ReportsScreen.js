import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { getFocusSessions, clearAllSessions } from "../utils/storage";

import ReportsHeader from "../components/reports/ReportsHeader";
import StatsGrid from "../components/reports/StatsGrid";
import PerformanceChart from "../components/reports/PerformanceChart";
import CategoryChart from "../components/reports/CategoryChart";

export default function ReportsScreen() {
  const [stats, setStats] = useState({
    todayFocus: 0,
    totalFocus: 0,
    totalDistractions: 0,
    sessionCount: 0,
  });

  const [barData, setBarData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [pieData, setPieData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const loadStatistics = async () => {
    const sessions = await getFocusSessions();
    let todayFocus = 0;
    let totalFocus = 0;
    let totalDistractions = 0;
    const todayStr = new Date().toDateString();

    sessions.forEach((session) => {
      totalFocus += session.duration;
      totalDistractions += session.distractions;
      const sessionDate = new Date(session.date).toDateString();
      if (sessionDate === todayStr) {
        todayFocus += session.duration;
      }
    });

    setStats({
      todayFocus,
      totalFocus,
      totalDistractions,
      sessionCount: sessions.length,
    });

    const categoryMap = {};
    sessions.forEach((session) => {
      if (!categoryMap[session.category]) {
        categoryMap[session.category] = 0;
      }
      categoryMap[session.category] += 1;
    });

    const pieColors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];
    const pData = Object.keys(categoryMap).map((key, index) => ({
      name: key,
      population: categoryMap[key],
      color: pieColors[index % pieColors.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));
    setPieData(pData);

    const last7Days = [];
    const last7DaysData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString("tr-TR", { weekday: "short" });
      const dateKey = d.toDateString();

      last7Days.push(dayStr);

      const dayTotal = sessions
        .filter((s) => new Date(s.date).toDateString() === dateKey)
        .reduce((sum, s) => sum + s.duration, 0);

      last7DaysData.push(dayTotal);
    }

    setBarData({
      labels: last7Days,
      datasets: [{ data: last7DaysData }],
    });
  };

  useEffect(() => {
    if (isFocused) {
      loadStatistics();
    }
  }, [isFocused]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  }, []);

  const handleClearData = async () => {
    Alert.alert("Verileri Temizle", "Tüm kayıtlar silinecek. Emin misin?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          await clearAllSessions();
          loadStatistics();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="px-5 flex-1">
        <ReportsHeader onClear={handleClearData} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <StatsGrid stats={stats} />

          <PerformanceChart data={barData} />

          <CategoryChart data={pieData} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}