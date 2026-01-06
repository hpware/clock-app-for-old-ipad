import {
  Button,
  Chip,
  Divider,
  Spinner,
  Surface,
  useThemeColor,
} from "heroui-native";
import { Text, View } from "react-native";
import { useState, useEffect } from "react";

import { Container } from "@/components/container";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 900);

    return () => clearInterval(timer);
  }, []);

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
            <Text className="text-xl font-semibold text-foreground/80 tracking-tight min-w-30">
              距離睡覺時間：
              {(() => {
                const now = new Date();
                const sleepTime = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate() + 1,
                  0,
                  0,
                  0,
                );
                const diff = sleepTime.getTime() - now.getTime();
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
      {/*      <Surface className="py-6 mb-4">
        Bed
      </Surface> */}
    </Container>
  );
}
