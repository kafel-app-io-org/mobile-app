import { Stack } from 'expo-router';

export default function CodeScanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Scan Code',
          headerStyle: {
            backgroundColor: '#74BB29',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="ScanQrCodeScreen"
        options={{
          headerShown: false,
          title: 'Scan Qr Code',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#74BB29',
        }}
      />
    </Stack>
  );
}
