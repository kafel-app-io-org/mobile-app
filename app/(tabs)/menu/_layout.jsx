import { Stack } from 'expo-router';

export default function MenuLayout() {
  return (
    <Stack
    screenOptions={{
      headerShown: false,
      headerStyle: {
        backgroundColor: '#74BB29',
      },
      headerTintColor: '#fff',
    }}
    >
      <Stack.Screen
        name="WithdrawalAccountsScreen"
        options={{
          headerShown: false,
          title: 'Withdrawal Accounts',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#74BB29',
          animation: 'slide_from_right',

        }}
      />
      <Stack.Screen
        name="DonationHistoryScreen"
        options={{
          headerShown: false,
          title: 'Donation History',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#74BB29',
          animation: 'slide_from_right',

        }}
      /><Stack.Screen
        name="DonationBenDistributionScreen"
        options={{
          headerShown: false,
          title: 'Beneficiaries',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#74BB29',
          animation: 'slide_from_right',

        }}
      /><Stack.Screen
        name="ProfileScreen"
        options={{
          headerShown: false,
          title: 'Profile',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#74fBB29',
          animation: 'slide_from_right',

        }}
      />
      <Stack.Screen
        name="Edit Profile"
        options={{
          headerShown: false,
          title: 'Beneficiaries',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#74BB29',
          animation: 'slide_from_right',

        }}
      />

    </Stack>
  );
}