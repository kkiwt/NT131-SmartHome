import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";

import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ref, onValue, set } from "firebase/database";
import { db } from "../../services/firebaseConfig";

export default function ControlScreen() {

  // Trạng thái hiển thị trên UI (Sync với thực tế từ ESP32)
  const [openMainDoor, setOpenMainDoor] = useState(false);
  const [openGarageDoor, setOpenGarageDoor] = useState(false);

  const [livingLight, setLivingLight] = useState(false);
  const [bedroomLight, setBedroomLight] = useState(false);
  const [garageLight, setGarageLight] = useState(false);

  const [autoGarage, setAutoGarage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [password, setPassword] = useState("");

  // 🔥 UPDATE FIREBASE (Sửa lại để chỉ tập trung gửi lệnh Command)
  const sendCommand = async (commandPath: string, value: any) => {
    try {
      await set(ref(db, `smarthome/commands/${commandPath}`), value);
    } catch (error) {
      console.error("Lỗi gửi lệnh:", error);
    }
  };

  // =========================
  // HANDLERS (Chỉ gửi lệnh, UI sẽ tự nhảy khi Firebase báo về)
  // =========================

  const toggleOpenMainDoor = (val: boolean) => {
    sendCommand("open_door", val ? true : false);
  };

  const toggleOpenGarageDoor = (val: boolean) => {
    sendCommand("open_garage", val ? true : false);
  };

  const toggleLivingLight = (val: boolean) => {
    sendCommand("toggle_light_1", val ? true : false);
  };

  const toggleBedroomLight = (val: boolean) => {
    sendCommand("toggle_light_2", val ? true : false);
  };

  const toggleGarageLight = (val: boolean) => {
    sendCommand("toggle_light_3", val ? true : false);
  };

  const toggleAutoGarage = (val: boolean) => {
    sendCommand("enable_auto_garage", val);
  };

  // 🔥 LẮNG NGHE TRẠNG THÁI THỰC TẾ (REALTIME)
  useEffect(() => {
    const devicesRef = ref(db, 'smarthome/devices');

    const unsubscribe = onValue(devicesRef, (snap) => {
      const data = snap.val();
      if (!data) return;

      // CẬP NHẬT CỬA CHÍNH (Kiểm tra khớp với Backend của ông: "open" hoặc "opened")
      if (data.door) {
        setOpenMainDoor(data.door.status === "open" || data.door.status === "opened");
      }

      // CẬP NHẬT GARA
      if (data.garage_door) {
        setOpenGarageDoor(data.garage_door.status === "open" || data.garage_door.status === "opened");
        setAutoGarage(data.garage_door.auto_mode === true);
      }

      // CẬP NHẬT ĐÈN
      const lights = data.lights;
      if (lights) {
        if (lights.light_1) setLivingLight(lights.light_1.status === "on");
        if (lights.light_2) setBedroomLight(lights.light_2.status === "on");
        if (lights.light_3) setGarageLight(lights.light_3.status === "on");
      }
    });

    return () => unsubscribe(); 
  }, []);

  // --- GIỮ NGUYÊN CÁC HÀM PHỤ TRỢ ---
  const handleChangePassword = () => {
    if (!password) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
      return;
    }
    Alert.alert("Xác nhận", "Đổi mật khẩu?", [
      { text: "Huỷ" },
      { text: "OK", onPress: () => { setPassword(""); Alert.alert("Thành công"); } }
    ]);
  };

  const renderItem = (
    title: string,
    value: boolean,
    setValue: (v: boolean) => void,
    onText: string,
    offText: string
  ) => (
    <View style={styles.box}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.status}>Thực tế: {value ? onText : offText}</Text>
      <Switch value={value} onValueChange={setValue} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Smart Home Control</Text>

      {/* Voice */}
      <View style={styles.box}>
        <Text style={styles.label}>Voice Control</Text>
        <TouchableOpacity
          style={[styles.voiceButton, { backgroundColor: isRecording ? "#ff4d4d" : "#4CAF50" }]}
          onPressIn={() => setIsRecording(true)}
          onPressOut={() => setIsRecording(false)}
        >
          <Ionicons name="mic" size={35} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Danh sách thiết bị - GIỮ NGUYÊN UI/TEXT */}
      {renderItem("Mở Cửa Chính", openMainDoor, toggleOpenMainDoor, "Đang Mở", "Đã Đóng")}
      {renderItem("Mở Cửa Gara", openGarageDoor, toggleOpenGarageDoor, "Đang Mở", "Đã Đóng")}
      {renderItem("Đèn Phòng Khách", livingLight, toggleLivingLight, "Đang Bật", "Đang Tắt")}
      {renderItem("Đèn Phòng Ngủ", bedroomLight, toggleBedroomLight, "Đang Bật", "Đang Tắt")}
      {renderItem("Đèn Gara", garageLight, toggleGarageLight, "Đang Bật", "Đang Tắt")}

      <View style={styles.box}>
        <Text style={styles.label}>Tự động Gara</Text>
        <Switch value={autoGarage} onValueChange={toggleAutoGarage} />
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Đổi mật khẩu</Text>
        <TextInput
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", backgroundColor: "#D79AA3", paddingVertical: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  box: { backgroundColor: "#C6908F", width: "85%", padding: 15, borderRadius: 15, marginBottom: 15, alignItems: "center", elevation: 4 },
  label: { fontSize: 17, fontWeight: "bold", color: "#fff" },
  status: { marginVertical: 5, color: "#eee" },
  input: { backgroundColor: "#fff", width: "100%", padding: 10, borderRadius: 8, marginTop: 10 },
  button: { backgroundColor: "#444", padding: 12, borderRadius: 8, marginTop: 10, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  voiceButton: { width: 70, height: 70, borderRadius: 35, justifyContent: "center", alignItems: "center", marginTop: 10 }
});