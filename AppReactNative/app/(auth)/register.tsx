import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      setToast("Bạn đã đăng ký thành công");

      setTimeout(() => {
        setToast("");
        router.replace("/profile");
      }, 1500);
    } catch (error) {
      setToast("Email đã tồn tại hoặc lỗi định dạng");
      setTimeout(() => setToast(""), 1500);
    }
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị Toast */}
      {toast !== "" && (
        <View style={styles.toast}>
          <Text style={{ color: "white", textAlign: "center" }}>{toast}</Text>
        </View>
      )}

      <Text style={styles.title}>Smarthome</Text>
      <Text style={styles.subtitle}>ĐĂNG KÝ</Text>

      <View style={styles.formBox}>
        <Text style={styles.label}>Gmail:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập Gmail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mật Khẩu:</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.eye} onPress={() => setShowPassword(!showPassword)}>
            <Text>{showPassword ? "Ẩn" : "Hiện"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={{ alignSelf: "flex-end", marginTop: 5 }}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
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
  inputPassword: {
    backgroundColor: "#E5E5E5",
    borderRadius: 25,
    padding: 10,
    marginTop: 5,
    paddingRight: 50 // Giữ khoảng cách không cho chữ đè lên chữ Ẩn/Hiện
  },
  eye: {
    position: "absolute",
    right: 15,
    top: 18
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
  },
  toast: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    zIndex: 999
  }
});