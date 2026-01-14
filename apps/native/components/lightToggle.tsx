import { TouchableOpacity, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
export default function lightToggle({
  deviceName,
  haDeviceId,
  currentState,
}: {
  deviceName: string;
  haDeviceId: string;
  currentState: boolean;
}) {
  const toggleRequest = useMutation({
    mutationFn: async (data: { state: boolean }) => {
      toast.promise(
        async () => {
          try {
            const getAPIServer = await SecureStore.getItemAsync("apiServer");
            const req = await fetch(
              `${getAPIServer}/api/single/ha_set/${haDeviceId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ state: data.state }),
              },
            );
            if (!req.ok) {
              throw new Error("Failed to toggle light");
            }
            return;
          } catch (e) {
            throw e;
          }
        },
        {
          // loading: "Toggling light...",
          error: (e: any) => `Failed to toggle light: ${e.message}`,
        },
      );
    },
  });
  return (
    <TouchableOpacity
      onPress={() => toggleRequest.mutate({ state: !currentState })}
    >
      <Text>{deviceName}</Text>
    </TouchableOpacity>
  );
}
