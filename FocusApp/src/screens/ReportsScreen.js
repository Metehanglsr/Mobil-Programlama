import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { getFocusSessions, clearAllSessions } from "../utils/storage";
import { BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

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
    <View className="flex-1 bg-gray-50 pt-16 px-5">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-gray-800">Raporlar</Text>
        <TouchableOpacity
          onPress={handleClearData}
          className="bg-red-100 px-3 py-1 rounded-lg"
        >
          <Text className="text-red-500 font-bold text-xs">TEMİZLE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View className="flex-row flex-wrap justify-between mb-6">
          <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4 border-l-4 border-blue-500">
            <Text className="text-gray-500 text-xs font-bold uppercase mb-1">
              Bugün
            </Text>
            <Text className="text-2xl font-bold text-gray-800">
              {stats.todayFocus}{" "}
              <Text className="text-sm font-normal text-gray-500">dk</Text>
            </Text>
          </View>
          <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4 border-l-4 border-purple-500">
            <Text className="text-gray-500 text-xs font-bold uppercase mb-1">
              Toplam
            </Text>
            <Text className="text-2xl font-bold text-gray-800">
              {stats.totalFocus}{" "}
              <Text className="text-sm font-normal text-gray-500">dk</Text>
            </Text>
          </View>
          <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4 border-l-4 border-red-500">
            <Text className="text-gray-500 text-xs font-bold uppercase mb-1">
              Dağınıklık
            </Text>
            <Text className="text-2xl font-bold text-gray-800">
              {stats.totalDistractions}{" "}
              <Text className="text-sm font-normal text-gray-500">kez</Text>
            </Text>
          </View>
          <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4 border-l-4 border-green-500">
            <Text className="text-gray-500 text-xs font-bold uppercase mb-1">
              Seanslar
            </Text>
            <Text className="text-2xl font-bold text-gray-800">
              {stats.sessionCount}{" "}
              <Text className="text-sm font-normal text-gray-500">adet</Text>
            </Text>
          </View>
        </View>

        <Text className="text-lg font-bold text-gray-700 mb-3 ml-1">
          Son 7 Günlük Performans
        </Text>
        <View className="items-center bg-white rounded-2xl p-2 mb-8 shadow-sm overflow-hidden">
          <BarChart
            data={barData}
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

        {pieData.length > 0 && (
          <>
            <Text className="text-lg font-bold text-gray-700 mb-3 ml-1">
              Kategori Dağılımı
            </Text>
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 items-center">
              <PieChart
                data={pieData}
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
          </>
        )}
      </ScrollView>
    </View>
  );
}