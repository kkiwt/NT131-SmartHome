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
  const [garageDoor, setGarageDoor] = useState(false);
  const [mainDoor, setMainDoor] = useState(true);
  const [livingLight, setLivingLight] = useState(false);
  const [bedroomLight, setBedroomLight] = useState(false);
  const [garageLight, setGarageLight] = useState(false);

  const [autoGarage, setAutoGarage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [password, setPassword] = useState("");

  // 🔥 CHỈ GỬI LỆNH (COMMANDS)
  // App không cầm quyền tự quyết định trạng thái thiết bị nữa
  const sendCommand = async (cmdKey: string, value: any) => {
    try {
      await set(ref(db, `smarthome/commands/${cmdKey}`), value);
    } catch (error) {
      console.error("Lỗi gửi lệnh:", error);
    }
  };

  // --- Handlers cho Switch ---
  // Lưu ý: Ta vẫn set local state tạm thời để Switch trượt đi mượt mà (Optimistic UI), 
  // nhưng giá trị thực sự sẽ được update lại từ Firebase useEffect.

  const toggleGarageDoor = (val: boolean) => {
    setGarageDoor(val); // Trượt switch trên UI
    sendCommand("open_garage", !val); // Nếu val=true (Khoá) -> gửi lệnh open=false
  };

  const toggleMainDoor = (val: boolean) => {
    setMainDoor(val);
    sendCommand("unlock_door", !val); // Nếu val=true (Khoá) -> gửi lệnh unlock=false
  };

  const toggleLivingLight = (val: boolean) => {
    setLivingLight(val);
    sendCommand("toggle_light_1", val);
  };

  const toggleBedroomLight = (val: boolean) => {
    setBedroomLight(val);
    sendCommand("toggle_light_2", val);
  };

  const toggleGarageLight = (val: boolean) => {
    setGarageLight(val);
    sendCommand("toggle_light_3", val);
  };

  const toggleAutoGarage = (val: boolean) => {
    setAutoGarage(val);
    sendCommand("enable_auto_garage", val);
  };

  // 🔥 LẮNG NGHE TRẠNG THÁI THỰC TẾ (DEVICES)
  // Đây là nơi UI cập nhật dựa trên những gì ESP32 báo cáo
  useEffect(() => {
    const devicesRef = ref(db, 'smarthome/devices');
    return onValue(devicesRef, (snap) => {
      const data = snap.val();
      if (!data) return;

      // Cập nhật Cửa từ thực tế
      if (data.garage_door) setGarageDoor(data.garage_door.status === 'closed');
      if (data.door_lock_main) setMainDoor(data.door_lock_main.status === 'locked');

      // Cập nhật Đèn từ thực tế (nhánh lights)
      const lights = data.lights;
      if (lights) {
        if (lights.light_1) setLivingLight(lights.light_1.status === 'on');
        if (lights.light_2) setBedroomLight(lights.light_2.status === 'on');
        if (lights.light_3) setGarageLight(lights.light_3.status === 'on');
      }
    });
  }, []);

  // Các hàm phụ trợ khác giữ nguyên...
  const handleChangePassword = () => {
    if (!password) { Alert.alert("Lỗi", "Vui lòng nhập mật khẩu"); return; }
    Alert.alert("Xác nhận", "Đổi mật khẩu?", [
      { text: "Huỷ" },
      { text: "OK", onPress: () => { setPassword(""); Alert.alert("Thành công"); } }
    ]);
  };

  const renderItem = (title: string, value: boolean, setValue: (v: boolean) => void, onText: string, offText: string) => (
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

      {/* Danh sách thiết bị */}
      {renderItem("Cửa Gara", garageDoor, toggleGarageDoor, "Đã Khoá", "Đang Mở")}
      {renderItem("Cửa Chính", mainDoor, toggleMainDoor, "Đã Khoá", "Đang Mở")}
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