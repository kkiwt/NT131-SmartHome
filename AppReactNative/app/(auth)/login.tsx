import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setToast("Bạn đã đăng nhập thành công");

      setTimeout(() => {
        setToast("");
        router.replace("/(tabs)");
      }, 1500);
    } catch (_) {
      setToast("Sai tài khoản hoặc mật khẩu");
      setTimeout(() => setToast(""), 1500);
    }
  };

  return (
    <View style={styles.container}>
      {toast !== "" && (
        <View style={styles.toast}>
          <Text style={{ color: "white" }}>{toast}</Text>
        </View>
      )}

      <Text style={styles.title}>Smarthome</Text>
      <Text style={styles.subtitle}>ĐĂNG NHẬP</Text>

      <View style={styles.formBox}>
        <Text style={styles.label}>Gmail:</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mật Khẩu:</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            style={styles.inputPassword}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eye} onPress={() => setShowPassword(!showPassword)}>
            <Text>{showPassword ? "Ẩn" : "Hiện"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D79AA3", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 34, fontWeight: "bold" },
  subtitle: { fontSize: 18, marginBottom: 20 },
  formBox: { width: "80%", backgroundColor: "#C6908F", padding: 20, borderRadius: 30 },
  label: { fontWeight: "bold", marginTop: 10 },
  input: { backgroundColor: "#E5E5E5", borderRadius: 25, padding: 10, marginTop: 5 },
  inputPassword: { backgroundColor: "#E5E5E5", borderRadius: 25, padding: 10, marginTop: 5, paddingRight: 50 },
  forgot: { alignSelf: "flex-end", marginTop: 5 },
  button: { backgroundColor: "black", padding: 15, borderRadius: 30, marginTop: 20, width: 200, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
  link: { marginTop: 15 },
  eye: { position: "absolute", right: 15, top: 18 },
  toast: {
    position: "absolute",
    top: 50,
    right: Platform.OS === "web" ? 20 : undefined,
    alignSelf: Platform.OS !== "web" ? "center" : undefined,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    zIndex: 999
  }
});