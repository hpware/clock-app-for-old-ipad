import { TouchableOpacity, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { Ionicons } from "@expo/vector-icons";

export default function LightToggle({
  deviceName,
  haDeviceId,
  currentState,
}: {
  deviceName: string;
  haDeviceId: string;
  currentState: boolean;
}) {
  const queryClient = useQueryClient();

  const toggleRequest = useMutation({
    mutationFn: async (data: { state: boolean }) => {
      const serverUrl = await SecureStore.getItemAsync("serverUrl");
      const token = await SecureStore.getItemAsync("apiToken");
      if (!serverUrl) throw new Error("No server URL configured");
      if (!token) throw new Error("No API token configured");

      const req = await fetch(
        `${serverUrl}/api/single/ha_set/${haDeviceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ state: data.state }),
        },
      );
      if (!req.ok) {
        throw new Error("Failed to toggle light");
      }
      return data.state;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lightState"] });
    },
    onError: (e: Error) => {
      toast.error(`Failed to toggle light: ${e.message}`);
    },
  });

  return (
    <TouchableOpacity
      onPress={() => toggleRequest.mutate({ state: !currentState })}
      className="flex-row items-center justify-between p-4 rounded-lg bg-default-100"
    >
      <View className="flex-row items-center gap-3">
        <Ionicons
          name={currentState ? "bulb" : "bulb-outline"}
          size={24}
          color={currentState ? "#fbbf24" : "#6b7280"}
        />
        <Text className="text-lg text-foreground">{deviceName || haDeviceId}</Text>
      </View>
      <View
        className={`w-12 h-7 rounded-full justify-center ${currentState ? "bg-success items-end" : "bg-default-300 items-start"}`}
      >
        <View className="w-5 h-5 rounded-full bg-white m-1" />
      </View>
    </TouchableOpacity>
  );
}
