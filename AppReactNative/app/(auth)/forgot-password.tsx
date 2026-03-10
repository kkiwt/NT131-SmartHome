import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { router } from "expo-router";
import { useState } from "react";

export default function ForgotPassword() {

  const [email,setEmail] = useState("");

  const resetPassword = async () => {
    try{
      await sendPasswordResetEmail(auth,email);
      Alert.alert("Thành công","Email reset mật khẩu đã được gửi.");
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
    marginTop:20,
    backgroundColor:"black",
    padding:15,
    borderRadius:20
  },

  buttonText:{
    color:"white"
  }

});