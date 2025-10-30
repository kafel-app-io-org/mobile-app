// app/campaign/link/[id].tsx
import { Redirect, useLocalSearchParams } from "expo-router";

export default function LinkAlias() {
  const { id } = useLocalSearchParams();
  // Navigate into your real details screen path under the tabs layout
  return <Redirect href={`/(tabs)/campaigns/CampaignDetailsScreen?id=${id}`} />;
  // If your details screen is a dynamic file like /(tabs)/campaigns/[id].tsx, use:
  // return <Redirect href={`/(tabs)/campaigns/${id}`} />;
}
