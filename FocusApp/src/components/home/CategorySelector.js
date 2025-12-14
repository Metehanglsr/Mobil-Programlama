import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CategorySelector({
  categories,
  selectedCategory,
  onSelect,
  onAdd,
  onRemove,
  isLocked,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAdd = () => {
    if (newCategoryName.trim()) {
      onAdd(newCategoryName.trim());
      setNewCategoryName("");
      setModalVisible(false);
    }
  };

  return (
    <View>
      <View className="flex-row flex-wrap justify-between w-full mb-4">
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelect(category)}
            onLongPress={() => !isLocked && onRemove(category)}
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

        {!isLocked && (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="w-[48%] py-4 rounded-xl items-center mb-3 border border-dashed border-gray-400 bg-gray-50"
          >
            <View className="flex-row items-center">
              <Ionicons name="add-circle-outline" size={20} color="gray" />
              <Text className="text-gray-500 font-medium ml-2">Ekle</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-4/5 shadow-xl">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Yeni Kategori Ekle
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
              placeholder="Örn: Spor, Yoga..."
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 mr-2"
              >
                <Text className="text-gray-700 font-bold">İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAdd}
                className="px-4 py-2 rounded-lg bg-red-500"
              >
                <Text className="text-white font-bold">Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}