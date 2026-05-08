import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { auth } from "../../services/firebaseConfig";
import { getDatabase, ref, set } from "firebase/database";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");

  const handleSave = async () => {
    if (!name || !gender) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const uid = auth.currentUser?.uid;
    
    // Kiểm tra an toàn nếu chưa lấy được ID người dùng
    if (!uid) {
      alert("Lỗi xác thực. Vui lòng đăng nhập lại.");
      router.replace("/login");
      return;
    }

    const db = getDatabase();

    await set(ref(db, "users/" + uid + "/profile"), {
      name,
      gender,
      avatar: "https://i.pravatar.cc/150"
    });

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>

      <Image
        source={{ uri: "https://i.pravatar.cc/150" }}
        style={styles.avatar}
      />

      <TextInput
        style={styles.input}
        placeholder="Họ tên"
        value={name}
        onChangeText={setName}
      />

      {/* 🔥 GIỚI TÍNH */}
      <View style={styles.genderBox}>
        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => setGender("Nam")}
        >
          <View style={styles.radio}>
            {gender === "Nam" && <View style={styles.radioInner} />}
          </View>
          <Text>Nam</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => setGender("Nữ")}
        >
          <View style={styles.radio}>
            {gender === "Nữ" && <View style={styles.radioInner} />}
          </View>
          <Text>Nữ</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#D79AA3" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  input: { width: "80%", backgroundColor: "#fff", padding: 10, borderRadius: 25, marginBottom: 15 },
  genderBox: { flexDirection: "row", gap: 20, marginBottom: 20 },
  genderOption: { flexDirection: "row", alignItems: "center", gap: 5 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "black" },
  button: { backgroundColor: "black", padding: 15, borderRadius: 30, width: 200, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" }
});