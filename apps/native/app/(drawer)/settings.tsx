import {
  Button,
  Chip,
  Divider,
  Spinner,
  Surface,
  useThemeColor,
} from "heroui-native";
import { Text, TextInput, View } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Container } from "@/components/container";
export default function Home() {
  const theme = useThemeColor("accent");
  return (
    <Container className="p-4">
      <Text className="text-5xl font-bold text-foreground">Settings</Text>
      <Surface className="py-6 mb-4">
        <Text className="text-2xl font-bold text-foreground">General</Text>
        <View className="flex-row items-center justify-between mt-4">
          <Text className="text-base text-foreground">Theme</Text>
          <Button
            onPress={() => {
              //theme.toggle();
            }}
          >
            <Ionicons
              name={theme.isDark ? "moon-outline" : "sunny-outline"}
              size={24}
              //color={theme.isDark ? themeColorForeground : themeColorBackground}
            />
          </Button>
        </View>
      </Surface>
      <Surface className="py-6 mb-4">
        <Text className="text-2xl font-bold text-foreground mb-6">
          Credentials
        </Text>
        <View>
          <Text className="text-xl text-foreground mb-2">
            Your Beszel Instance
          </Text>
          <View className="flex flex-col">
            <Text className="text-foreground">Email:</Text>
            <TextInput className="text-foreground p-1 border border-foreground rounded m-1" />
          </View>
          <View className="flex flex-col">
            <Text className="text-foreground">Password:</Text>
            <TextInput
              className="text-foreground p-1 border rounded m-1 border-foreground"
              secureTextEntry={true}
            />
          </View>
          <Button>Submit!</Button>
        </View>
      </Surface>
    </Container>
  );
}
