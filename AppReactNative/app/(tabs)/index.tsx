import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebase";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Thành công", "Đăng ký thành công!");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Smarthome</Text>
        <Text style={styles.subtitle}>ĐĂNG KÝ</Text>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Gmail:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Mật Khẩu:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made By Tuan Kiet & Minh Kiet</Text>
        <Text style={styles.footerText}>© 2026 NT131 - UIT</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
  },

  header: {
    height: 80,
    backgroundColor: "#0d47a1",
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 40,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  label: {
    width: 90,
    fontSize: 18,
  },

  input: {
    backgroundColor: "#bbb",
    width: 200,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
  },

  button: {
    marginTop: 20,
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    height: 80,
    backgroundColor: "#0d47a1",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    color: "black",
    fontSize: 12,
  },
});