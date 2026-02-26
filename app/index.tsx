import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addTask, deleteTask, getTasks, initDB } from '../db';

export default function HomeScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('RU');

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    initDB();
    loadData();
  }, []);

  const loadData = async () => {
    const savedTheme = await AsyncStorage.getItem('theme');
    setIsDark(savedTheme === 'dark');
    const savedLang = await AsyncStorage.getItem('lang');
    if (savedLang) setLang(savedLang);
    setTasks(getTasks());
  };

  const handleCreateTask = () => {
    if (title.trim() === '') return;

    addTask(title, desc, date);

    setTitle('');
    setDesc('');
    setModalVisible(false);

    setTasks(getTasks());
  };

  const theme = isDark ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, theme.container]}>
      {/* ШАПКА */}
      <View style={styles.headerRow}>
        <Text style={[styles.header, theme.text]}>
          {lang === 'RU' ? 'Задачи' : 'Tasks'}
        </Text>
        <TouchableOpacity 
          style={styles.plusButton} 
          onPress={() => setModalVisible(true)} 
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.taskCard, theme.card]}
            onPress={() => router.push({ pathname: '/details/[id]', params: { id: item.id } } as any)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskTitle, theme.text]}>{item.title}</Text>
              <Text style={styles.taskDate}>{item.date}</Text>
            </View>
            <TouchableOpacity onPress={() => { deleteTask(item.id); setTasks(getTasks()); }}>
              <Text style={{ color: '#FF4444' }}>DEL</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings' as any)}>
        <Text style={{ color: '#fff' }}>{lang === 'RU' ? 'Настройки' : 'Settings'}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, theme.card]}>
            <Text style={[styles.modalTitle, theme.text]}>
              {lang === 'RU' ? 'Новая задача' : 'New Task'}
            </Text>

            <TextInput
              style={[styles.input, theme.input]}
              placeholder={lang === 'RU' ? 'Заголовок' : 'Title'}
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, theme.input, { height: 80 }]}
              placeholder={lang === 'RU' ? 'Описание' : 'Description'}
              placeholderTextColor="#888"
              multiline
              value={desc}
              onChangeText={setDesc}
            />

            <TextInput
              style={[styles.input, theme.input]}
              placeholder={lang === 'RU' ? 'Дата' : 'Date'}
              placeholderTextColor="#888"
              value={date}
              onChangeText={setDate}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.btn, { backgroundColor: '#FF4444' }]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>{lang === 'RU' ? 'Отмена' : 'Cancel'}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.btn, { backgroundColor: '#28a745' }]} 
                onPress={handleCreateTask}
              >
                <Text style={styles.btnText}>{lang === 'RU' ? 'Создать' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 28, fontWeight: 'bold' },
  plusButton: { backgroundColor: '#007AFF', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  plusText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  taskCard: { flexDirection: 'row', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', elevation: 2 },
  taskTitle: { fontSize: 18, fontWeight: '500' },
  taskDate: { color: '#888', fontSize: 12 },
  settingsBtn: { backgroundColor: '#333', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25, minHeight: 400 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  btnText: { color: 'white', fontWeight: 'bold' }
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#F5F5F7' },
  text: { color: '#000' },
  input: { borderColor: '#DDD', backgroundColor: '#FFF', color: '#000' },
  card: { backgroundColor: '#FFF' }
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  text: { color: '#FFF' },
  input: { borderColor: '#333', backgroundColor: '#1E1E1E', color: '#FFF' },
  card: { backgroundColor: '#1E1E1E' }
});