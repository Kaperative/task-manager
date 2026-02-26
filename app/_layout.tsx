import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ 
        headerShown: false,
        animation: 'fade' 
    }}>
      <Stack.Screen name="index" /> 

      <Stack.Screen 
        name="settings" 
        options={{ 
            headerShown: true, 
            title: 'Настройки' 
        }} 
      />

      <Stack.Screen 
        name="details/[id]" 
        options={{ 
            headerShown: true, 
            title: 'Детали задачи' 
        }} 
      />
    </Stack>
  );
}