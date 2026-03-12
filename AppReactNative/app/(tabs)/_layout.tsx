import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {

  return (
    <Tabs screenOptions={{ headerShown:false }}>

      <Tabs.Screen
        name="index"
        options={{
          title: "Thông số"
        }}
      />

      <Tabs.Screen
        name="control"
        options={{
          title: "Điều khiển"
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Cài đặt"
        }}
      />

    </Tabs>
  );
}