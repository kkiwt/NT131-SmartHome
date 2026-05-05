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
import { useState } from "react";

export default function ControlScreen() {

  const [garageDoor, setGarageDoor] = useState(false);
  const [mainDoor, setMainDoor] = useState(true);
  const [livingLight, setLivingLight] = useState(false);
  const [bedroomLight, setBedroomLight] = useState(false);

  const [password, setPassword] = useState("");

  const handleChangePassword = () => {
    if (!password) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
      return;
    }

    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn đổi mật khẩu?",
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () => {
            Alert.alert("Thành công", "Đã đổi mật khẩu");
            setPassword("");
          }
        }
      ]
    );
  };

  const renderItem = (title, value, setValue, onText, offText) => (
    <View style={styles.box}>
      <Text style={styles.label}>{title}</Text>

      <Text style={styles.status}>
        Trạng thái: {value ? onText : offText}
      </Text>

      <Switch
        value={value}
        onValueChange={setValue}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Điều khiển thiết bị</Text>

      {renderItem("Khoá cửa gara", garageDoor, setGarageDoor, "Mở", "Đóng")}
      {renderItem("Khoá cửa chính", mainDoor, setMainDoor, "Mở", "Đóng")}
      {renderItem("Đèn phòng khách", livingLight, setLivingLight, "Bật", "Tắt")}
      {renderItem("Đèn phòng ngủ", bedroomLight, setBedroomLight, "Bật", "Tắt")}

      {/* Đổi mật khẩu */}
      <View style={styles.box}>
        <Text style={styles.label}>Đổi mật khẩu</Text>

        <TextInput
          placeholder="Nhập mật khẩu mới"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D79AA3",
    paddingVertical: 20
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30
  },

  box: {
    backgroundColor: "#C6908F",
    width: "80%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center"
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },

  status: {
    marginBottom: 10,
    fontSize: 16
  },

  input: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },

  button: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }

});