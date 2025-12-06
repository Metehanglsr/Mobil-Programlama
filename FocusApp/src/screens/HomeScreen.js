import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Kodlama');
  const categories = ['Ders Çalışma', 'Kodlama', 'Proje', 'Kitap Okuma'];

  return (
    <View className="flex-1 bg-white items-center pt-16 px-5">
      
      <Text className="text-3xl font-bold mb-8 text-gray-800">
        Odaklanma Zamanı
      </Text>

      <View className="items-center mb-10 p-8 rounded-full border-[6px] border-red-500 w-64 h-64 justify-center bg-red-50">
        <Text className="text-6xl font-bold text-red-500">
          25:00
        </Text>
        <Text className="text-sm text-gray-500 mt-2 font-medium">
          Odaklanmaya Hazır mısın?
        </Text>
      </View>

      <Text className="text-lg font-semibold mb-4 self-start text-gray-700 ml-1">
        Kategori Seç
      </Text>

      <View className="flex-row flex-wrap justify-between w-full mb-8">
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`w-[48%] py-4 rounded-xl items-center mb-3 border ${
              selectedCategory === category 
                ? 'bg-red-50 border-red-500' 
                : 'bg-gray-100 border-transparent'
            }`}
          >
            <Text
              className={`text-base font-medium ${
                selectedCategory === category ? 'text-red-500 font-bold' : 'text-gray-600'
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        className="bg-red-500 py-4 px-16 rounded-full shadow-lg active:bg-red-600"
      >
        <Text className="text-white text-xl font-bold tracking-widest">
          BAŞLATMA
        </Text>
      </TouchableOpacity>

    </View>
  );
}