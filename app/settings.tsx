import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('RU');

  useEffect(() => {
    loadSettings();
    
  }, []);

  const loadSettings = async () => {
    const d = await AsyncStorage.getItem('theme');
    const l = await AsyncStorage.getItem('lang');
    setIsDark(d === 'dark');
    if (l) setLang(l);
  };

  const toggleTheme = async () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    await AsyncStorage.setItem('theme', newTheme);  
  };

  const changeLang = async (l: string) => {
    setLang(l);
    await AsyncStorage.setItem('lang', l);
  };

  const theme = isDark ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, theme.container]}>
      <Text style={[styles.title, theme.text]}>{lang === 'RU' ? 'Настройки' : 'Settings'}</Text>
      
      <View style={styles.row}>
        <Text style={theme.text}>{lang === 'RU' ? 'Темная тема' : 'Dark Mode'}</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <View style={styles.row}>
        <Text style={theme.text}>{lang === 'RU' ? 'Язык' : 'Language'}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => changeLang('RU')} style={styles.langBtn}>
            <Text style={{ color: lang === 'RU' ? '#007AFF' : '#888' }}>RU</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLang('EN')} style={styles.langBtn}>
            <Text style={{ color: lang === 'EN' ? '#007AFF' : '#888' }}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
        <Text style={{ color: '#fff' }}>{lang === 'RU' ? 'Назад' : 'Back'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  langBtn: { marginLeft: 15, padding: 5 },
  backBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 40 },
});

const lightStyles = { container: { backgroundColor: '#FFF' }, text: { color: '#000' } };
const darkStyles = { container: { backgroundColor: '#121212' }, text: { color: '#FFF' } };