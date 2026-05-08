import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { router } from "expo-router";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState("");

  const resetPassword = async () => {
    if (email === "") {
      setToast("Vui lòng nhập email");
      setTimeout(() => setToast(""), 1500);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setToast("Vui lòng kiểm tra email để cập nhật mật khẩu (Kiểm tra cả thư rác)");

      setTimeout(() => {
        setToast("");
        router.replace("/login");
      }, 2500); // Tăng thời gian hiển thị một chút vì câu thông báo dài
    } catch (error) {
      setToast("Email không có trong hệ thống, vui lòng đăng kí");
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

      <Text style={styles.title}>Quên mật khẩu</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập Gmail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={resetPassword}>
        <Text style={styles.buttonText}>Tìm</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={{ marginTop: 20 }}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D79AA3"
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10
  },
  button: {
    marginTop: 25,
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "60%",
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  toast: {
    position: "absolute",
    top: 50,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    width: '90%',
    zIndex: 999
  }
});