import { Stack } from 'expo-router';
import { ImageBackground } from 'react-native';

export default function NotificationsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="AllNotificationsScreen"
        options={{
          headerShown: false,
          title: 'Notification',
          headerStyle: {
            backgroundColor: '#74BB29',
          },
          headerTintColor: '#fff',
        }}
      />

    </Stack>
  );
}
