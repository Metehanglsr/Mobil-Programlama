import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { getFocusSessions, clearAllSessions } from "../utils/storage";

export default function ReportsScreen() {
  const [stats, setStats] = useState({
    todayFocus: 0,
    totalFocus: 0,
    totalDistractions: 0,
    sessionCount: 0,
  });
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

  // --- YENİ: Verileri Silme Fonksiyonu ---
  const handleClearData = async () => {
    Alert.alert("Verileri Temizle", "Tüm kayıtlar silinecek. Emin misin?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          await clearAllSessions();
          loadStatistics(); // Ekranı güncelle (Hepsi 0 olacak)
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50 pt-16 px-5">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-gray-800">Raporlar</Text>
        {/* Temizleme Butonu */}
        <TouchableOpacity
          onPress={handleClearData}
          className="bg-red-100 px-3 py-1 rounded-lg"
        >
          <Text className="text-red-500 font-bold text-xs">VERİLERİ SİL</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row flex-wrap justify-between">
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
        <View className="bg-blue-50 p-4 rounded-xl mt-4">
          <Text className="text-blue-600 text-center font-medium">
            Grafikler yakında burada olacak! 📊
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}