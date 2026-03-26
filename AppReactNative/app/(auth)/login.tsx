import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";

export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");

    } catch (error) {
      Alert.alert("Lỗi", "Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Smarthome</Text>
      <Text style={styles.subtitle}>ĐĂNG NHẬP</Text>

      <View style={styles.formBox}>

        <Text style={styles.label}>Gmail:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập Gmail"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Mật Khẩu:</Text>

        <View style={{ position: "relative" }}>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 15,
              top: 12
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text>{showPassword ? "Ẩn" : "Hiện"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D79AA3",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 34,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20
  },
  formBox: {
    width: "80%",
    backgroundColor: "#C6908F",
    padding: 20,
    borderRadius: 30
  },
  label: {
    fontWeight: "bold",
    marginTop: 10
  },
  input: {
    backgroundColor: "#E5E5E5",
    borderRadius: 25,
    padding: 10,
    marginTop: 5
  },
  forgot: {
    alignSelf: "flex-end",
    marginTop: 5
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    width: 200,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  link: {
    marginTop: 15
  }
});