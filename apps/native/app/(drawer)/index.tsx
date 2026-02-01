import { Surface } from "heroui-native";
import { Text, View } from "react-native";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LightToggle from "@/components/lightToggle";
import { Container } from "@/components/container";
import { toast } from "sonner-native";
import * as SecureStore from "expo-secure-store";

export default function Home() {
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 900);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getLightState = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["lightState"] });
    }, 10000);

    return () => clearInterval(getLightState);
  }, [queryClient]);

  const { data: lightState } = useQuery({
    queryKey: ["lightState"],
    queryFn: async () => {
      try {
        const serverUrl = await SecureStore.getItemAsync("serverUrl");
        const token = await SecureStore.getItemAsync("apiToken");
        const currentDevices = await SecureStore.getItemAsync("currentDevices");
        if (!serverUrl) throw new Error("No server URL found");
        if (!token) throw new Error("No API token found");
        if (!currentDevices) throw new Error("No devices found");
        const req = await fetch(`${serverUrl}/api/batch/ha_get`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            devices: JSON.parse(currentDevices),
          }),
        });
        const res = await req.json();
        return res;
      } catch (e) {
        toast.error("Failed to fetch light state!");
        return {};
      }
    },
  });

  return (
    <Container className="p-4">
      <Surface className="py-6 mb-4">
        <View className="items-center">
          <View className="">
            <Text className="text-4xl font-semibold text-foreground/60 tracking-tight">
              {currentTime.toLocaleDateString("zh-TW", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View className="flex flex-row gap-4">
            {currentTime
              .toLocaleTimeString("zh-TW")
              .split(":")
              .map((time, index) => (
                <View key={index} className="flex flex-col items-center">
                  <Text className="text-8xl font-semibold text-foreground/80 tracking-tight min-w-30">
                    {time}
                    {index !== 2 ? ":" : ""}
                  </Text>
                </View>
              ))}
          </View>
          <View className="flex flex-row gap-4">
            <Text
              className="text-xl font-semibold text-foreground/80 tracking-tight min-w-30"
              /*           index={currentTime.toLocaleTimeString("zh-TW", {
     minute: "2-digit",
     hour: "2-digit",
   })} */
            >
              距離睡覺時間：
              {(() => {
                const sleepTime = new Date(
                  currentTime.getFullYear(),
                  currentTime.getMonth(),
                  currentTime.getDate() + 1,
                  0,
                  0,
                  0,
                );
                const diff = sleepTime.getTime() - currentTime.getTime();
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor(
                  (diff % (1000 * 60 * 60)) / (1000 * 60),
                );
                return `${hours !== 0 ? `${hours} 小時 ` : ""}${minutes !== 0 ? `${minutes} 分鐘` : ""}`;
              })()}
            </Text>
          </View>
        </View>
      </Surface>
      <Surface className="py-6 px-4 mb-4">
        <Text className="text-2xl font-bold text-foreground mb-4">燈光控制</Text>
        {lightState && Object.keys(lightState).length > 0 ? (
          <View className="gap-3">
            {Object.entries(lightState).map(([deviceId, state]) => (
              <LightToggle
                key={deviceId}
                deviceName={deviceId}
                haDeviceId={deviceId}
                currentState={Boolean(state)}
              />
            ))}
          </View>
        ) : (
          <Text className="text-foreground/60 text-center py-4">
            尚未設定裝置，請在設定中新增
          </Text>
        )}
      </Surface>
    </Container>
  );
}
