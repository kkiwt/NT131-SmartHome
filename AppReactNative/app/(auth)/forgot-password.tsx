import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { router } from "expo-router";
import { useState } from "react";

export default function ForgotPassword() {

  const [email,setEmail] = useState("");

  const resetPassword = async () => {

    if(email === ""){
      Alert.alert("Thông báo","Vui lòng nhập email");
      return;
    }

    try{
      await sendPasswordResetEmail(auth,email);
      Alert.alert("Thành công","Email reset mật khẩu đã được gửi.");
      router.push("/otp");
    }
    catch(error){
      Alert.alert("Lỗi","Email không tồn tại trong hệ thống");
    }
  }

  return(
    <View style={styles.container}>

      <Text style={styles.title}>Quên mật khẩu</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập Gmail"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={resetPassword}>
        <Text style={styles.buttonText}>Tìm</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={{marginTop:20}}>Quay lại đăng nhập</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#D79AA3"
  },
  title:{
    fontSize:24,
    marginBottom:20
  },
  input:{
    width:"80%",
    backgroundColor:"#fff",
    padding:10,
    borderRadius:10
  },
  button:{
    marginTop:25,
    backgroundColor:"black",
    paddingVertical:15,
    paddingHorizontal:40,
    borderRadius:25,
    width:"60%",
    alignItems:"center"
  },
  buttonText:{
    color:"white",
    fontSize:16,
    fontWeight:"bold"
  }
});