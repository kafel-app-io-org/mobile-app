import { Stack } from 'expo-router';

export default function TransactionsLayout() {
  return (
    <Stack  initialRouteName="AllTransactionsScreen">
      <Stack.Screen
        name="AllTransactionsScreen"
        options={{
          headerShown: false,
          title: 'AllTranactions',
          headerStyle: {
            backgroundColor: '#74BB29',
          },
          headerTintColor: '#fff',
          animation: 'slide_from_right', // ← ADD THIS

        }}
      />

      <Stack.Screen
        name="SendTransactionScreen"
        options={{
          headerShown: false,
          title: 'Send',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#74BB29',
          animation: 'slide_from_right', // ← ADD THIS

        }}
      />
      <Stack.Screen
        name="ReceiveTransactionScreen"
        options={{
          headerShown: false,
          title: 'Receive',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#74BB29',
          animation: 'slide_from_right', // ← ADD THIS

        }}
      />
      <Stack.Screen
        name="WithdrawScreen"
        options={{
          headerShown: false,
          title: 'Withdraw',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#74BB29',
          animation: 'slide_from_right', // ← ADD THIS

        }}
      />
      <Stack.Screen
        name="DepositScreen"
        options={{
          headerShown: false,
          title: 'Deposit',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#74BB29',
          animation: 'slide_from_right', // ← ADD THIS

        }}
      />
      <Stack.Screen
          name="TransactionDetailsScreen"
          options={{
            headerShown: false,
            title: "Transaction Details",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#74BB29",
          }}
        /> 
    </Stack>
  );
}
