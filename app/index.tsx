import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addTask, deleteTask, getTasks, initDB } from '../db';

export default function HomeScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('RU');

  useEffect(() => {
    initDB();
    loadData();
  }, []);

  const loadData = async () => {
    const savedTheme = await AsyncStorage.getItem('theme');
    setIsDark(savedTheme === 'dark');
    const savedLang = await AsyncStorage.getItem('lang');
    if (savedLang) setLang(savedLang);
    const data = getTasks();
    setTasks(data);
  };

  const handleAddTask = () => {
    if (title.trim().length === 0) return;
    const today = new Date().toLocaleDateString();
    addTask(title, 'Описание задачи...', today);
    setTitle('');
    setTasks(getTasks());
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
    setTasks(getTasks());
  };

  const theme = isDark ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, theme.container]}>
      <Text style={[styles.header, theme.text]}>
        {lang === 'RU' ? 'Менеджер задач' : 'Task Manager'}
      </Text>


      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, theme.input]}
          placeholder={lang === 'RU' ? 'Название задачи...' : 'Task title...'}
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.taskCard, theme.card]}>
            <TouchableOpacity 
              style={{ flex: 1 }}
              onPress={() => router.push({ pathname: '/details/[id]', params: { id: item.id } } as any)}
            >
              <Text style={[styles.taskTitle, theme.text]}>{item.title}</Text>
              <Text style={styles.taskDate}>{item.date}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={{ color: '#FF4444', fontWeight: 'bold' }}>DEL</Text>
            </TouchableOpacity>
          </View>
        )}
      />


      <TouchableOpacity 
        style={styles.settingsBtn}
        onPress={() => router.push('/settings' as any)}
      >
        <Text style={{ color: '#fff' }}>
          {lang === 'RU' ? 'Настройки' : 'Settings'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 12, marginRight: 10 },
  addButton: { backgroundColor: '#007AFF', borderRadius: 10, width: 50, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  taskCard: { 
    flexDirection: 'row', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
  },
  taskTitle: { fontSize: 18, fontWeight: '500' },
  taskDate: { color: '#888', fontSize: 12 },
  settingsBtn: { backgroundColor: '#333', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 }
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#F5F5F7' },
  text: { color: '#000' },
  input: { borderColor: '#DDD', backgroundColor: '#FFF' },
  card: { backgroundColor: '#FFF' }
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  text: { color: '#FFF' },
  input: { borderColor: '#333', backgroundColor: '#1E1E1E' },
  card: { backgroundColor: '#1E1E1E' }
});