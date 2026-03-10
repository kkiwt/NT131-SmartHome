import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smarthome Dashboard</Text>

      <Text>💡 Lights</Text>
      <Text>🌀 Fan</Text>
      <Text>🚪 Door</Text>
      <Text>🌡 Temperature</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
});