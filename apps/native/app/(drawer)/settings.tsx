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
import * as SecureStore from "expo-secure-store";
import { toast } from "sonner-native";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Container } from "@/components/container";
import { Ionicons } from "@expo/vector-icons";
export default function Home() {
  const [serverUrl, setServerUrl] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [currentDevices, setCurrentDevices] = useState<string[]>([]);
  const [currentTextBoxDeviceSlug, setCurrentTextBoxDeviceSlug] = useState("");
  const theme = useThemeColor("accent");
  useEffect(() => {
    SecureStore.getItemAsync("serverUrl").then((value) => {
      if (value) {
        setServerUrl(value);
      }
    });
    SecureStore.getItemAsync("apiToken").then((value) => {
      if (value) {
        setApiToken(value);
      }
    });
    SecureStore.getItemAsync("currentDevices").then((value) => {
      if (value) {
        setCurrentDevices(JSON.parse(value));
      }
    });
  }, []);
  const saveData = async () => {
    await SecureStore.setItemAsync("serverUrl", serverUrl);
    await SecureStore.setItemAsync("apiToken", apiToken);
    toast.success("Data saved successfully");
  };
  const saveIntoDeviceLightToggles = async () => {
    setCurrentDevices([...currentDevices, currentTextBoxDeviceSlug]);
    await SecureStore.setItemAsync(
      "currentDevices",
      JSON.stringify(currentDevices),
    );
    setCurrentTextBoxDeviceSlug("");
    toast.success("Device light toggles saved successfully");
  };
  return (
    <Container className="p-4">
      <Text className="text-5xl font-bold text-foreground">Settings</Text>
      <Surface className="py-6 mb-4">
        <Text className="text-2xl font-bold text-foreground mb-2">Generic</Text>
        <View>
          <Text className="text-xl text-foreground ">Your light toggles</Text>
          <View className="flex flex-col">
            <Text className="text-foreground">Device Slug:</Text>
            <TextInput
              className="text-foreground p-1 border border-foreground rounded m-1"
              value={currentTextBoxDeviceSlug}
              onChangeText={setCurrentTextBoxDeviceSlug}
            />
          </View>
          <Button onPress={() => saveIntoDeviceLightToggles()}>Add!</Button>
          {currentDevices.map((item, index) => (
            <View key={index}>
              <Text className="text-foreground">Device Slug: {item}</Text>
              <Button>
                <Ionicons name="trash" size={24} color="black" />
              </Button>
            </View>
          ))}
        </View>
      </Surface>
      <Surface className="py-6 mb-4">
        <Text className="text-2xl font-bold text-foreground mb-2">
          Credentials
        </Text>
        <View>
          <Text className="text-xl text-foreground mb-2">
            Your yh_custom_home Instance
          </Text>
          <View className="flex flex-col">
            <Text className="text-foreground">Server URL:</Text>
            <TextInput
              className="text-foreground p-1 border border-foreground rounded m-1"
              value={serverUrl}
              onChangeText={setServerUrl}
            />
          </View>
          <View className="flex flex-col">
            <Text className="text-foreground">API Token:</Text>
            <TextInput
              className="text-foreground p-1 border rounded m-1 border-foreground"
              secureTextEntry={true}
              value={apiToken}
              onChangeText={setApiToken}
            />
          </View>
          <Button onPress={() => saveData()}>Submit!</Button>
        </View>
      </Surface>
    </Container>
  );
}
