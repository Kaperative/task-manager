import React, { useEffect, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getTaskById, updateTask } from '../../db';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    const data = getTaskById(Number(id));
    if (data) {
      setTask(data);
    }
  }, [id]);

  const handleSave = () => {
    if (task) {
      updateTask(Number(id), task.title, task.description || '', task.date || '');
      router.back();
    }
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Заголовок:</Text>
      <TextInput 
        style={styles.input} 
        value={task.title} 

        onChangeText={(t: string) => setTask({ ...task, title: t })} 
      />
      
      <Text style={styles.label}>Описание задачи:</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        multiline
        numberOfLines={4}
        value={task.description || ''} 

        onChangeText={(t: string) => setTask({ ...task, description: t })} 
        placeholder="Введите описание..."
      />

      <Text style={styles.label}>Дата дедлайна:</Text>
      <TextInput 
        style={styles.input} 
        value={task.date || ''} 

        onChangeText={(t: string) => setTask({ ...task, date: t })} 
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Сохранить изменения</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>Отмена</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#28a745',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backBtn: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  backBtnText: {
    color: '#666',
    fontSize: 14,
  },
});