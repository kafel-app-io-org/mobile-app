import { Stack, Redirect } from "expo-router";

export default function CampaignsLayout() {
  return (
      <Stack initialRouteName="CampaignsScreen">
        <Stack.Screen
          name="CampaignsScreen"
          options={{
            headerShown: false,
            title: "All Campaigns",
            headerStyle: {
              backgroundColor: "#74BB29",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="CampaignDetailsScreen"
          options={{
            headerShown: false,
            title: "Campaign Details",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#74BB29",
          }}
        /> <Stack.Screen
          name="DonateCampaignScreen"
          options={{
            headerShown: false,
            title: "Donate Campaign",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#74BB29",
          }}
        />

           <Stack.Screen
          name="DonationHistoryScreen"
          options={{
            headerShown: false,
            title: "Donation History",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#74BB29",
          }}
        /> 
        
        
        
      </Stack>
  );
}