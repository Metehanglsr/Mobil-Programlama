import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, AppState } from 'react-native';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Kodlama');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);

  const appState = useRef(AppState.currentState);

  const categories = ['Ders Çalışma', 'Kodlama', 'Proje', 'Kitap Okuma'];

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/active/) &&
        (nextAppState === 'background' || nextAppState === 'inactive')
      ) {
        if (isActive) {
          setIsActive(false);
          setDistractionCount((prev) => prev + 1);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      Alert.alert("Tebrikler!", "Odaklanma seansı tamamlandı! 🎉");
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setDistractionCount(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <View className="flex-1 bg-white items-center pt-16 px-5">
      
      <Text className="text-3xl font-bold mb-4 text-gray-800">
        Odaklanma Zamanı
      </Text>

      <View className="bg-red-100 px-4 py-2 rounded-lg mb-6">
        <Text className="text-red-600 font-bold">
          Dikkat Dağınıklığı: {distractionCount}
        </Text>
      </View>

      <View className={`items-center mb-8 p-8 rounded-full border-[6px] w-64 h-64 justify-center ${isActive ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
        <Text className={`text-6xl font-bold ${isActive ? 'text-green-600' : 'text-red-500'}`}>
          {formatTime(timeLeft)}
        </Text>
        <Text className="text-sm text-gray-500 mt-2 font-medium">
          {isActive ? 'Hadi Bakalım, Odaklan!' : 'Odaklanmaya Hazır mısın?'}
        </Text>
      </View>

      <Text className="text-lg font-semibold mb-4 self-start text-gray-700 ml-1">
        Kategori Seç
      </Text>

      <View className="flex-row flex-wrap justify-between w-full mb-8">
        {categories.map((category) => {
          const isLocked = isActive || timeLeft !== 25 * 60;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              disabled={isLocked} 
              className={`w-[48%] py-4 rounded-xl items-center mb-3 border ${
                selectedCategory === category 
                  ? 'bg-red-50 border-red-500' 
                  : 'bg-gray-100 border-transparent'
              } ${isLocked ? 'opacity-40' : 'opacity-100'}`} 
            >
              <Text
                className={`text-base font-medium ${
                  selectedCategory === category ? 'text-red-500 font-bold' : 'text-gray-600'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row justify-between w-full px-4">
        {!isActive ? (
          <TouchableOpacity 
            onPress={startTimer}
            className="flex-1 bg-green-500 py-4 rounded-full shadow-lg mr-2 items-center"
          >
            <Text className="text-white text-xl font-bold">BAŞLAT</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={pauseTimer}
            className="flex-1 bg-yellow-500 py-4 rounded-full shadow-lg mr-2 items-center"
          >
            <Text className="text-white text-xl font-bold">DURAKLAT</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          onPress={resetTimer}
          className="bg-gray-200 py-4 px-6 rounded-full items-center ml-2"
        >
          <Text className="text-gray-600 text-xl font-bold">SIFIRLA</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}