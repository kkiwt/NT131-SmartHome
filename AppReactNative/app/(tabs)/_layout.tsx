import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {

  return (

    <Tabs screenOptions={{ headerShown:false }}>

      {/* Thông số */}
      <Tabs.Screen
        name="index"
        options={{
          title:"Thông số",
          tabBarIcon: ({color,size}) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />

      {/* Điều khiển */}
      <Tabs.Screen
        name="control"
        options={{
          title:"Điều khiển",
          tabBarIcon: ({color,size}) => (
            <Ionicons name="game-controller" size={size} color={color} />
          ),
        }}
      />

      {/* Thông báo */}
      <Tabs.Screen
        name="notification"
        options={{
          title:"Thông báo",
          tabBarIcon: ({color,size}) => (
            <Ionicons name="alert-circle" size={size} color={color} />
          ),
        }}
      />

      {/* Cài đặt */}
      <Tabs.Screen
        name="settings"
        options={{
          title:"Cài đặt",
          tabBarIcon: ({color,size}) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />

    </Tabs>

  );
}