import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Smarthome</Text>
      <Text style={styles.subtitle}>ĐĂNG NHẬP</Text>

      <View style={styles.formBox}>

        <Text style={styles.label}>Gmail:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập Gmail"
        />

        <Text style={styles.label}>Mật Khẩu:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          secureTextEntry
        />

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(tabs)")}
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