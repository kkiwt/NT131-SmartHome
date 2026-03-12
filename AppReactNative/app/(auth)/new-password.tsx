import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

export default function NewPassword(){

  const [password,setPassword] = useState("");

  const handleConfirm = () => {

    if(password === ""){
      alert("Vui lòng nhập mật khẩu mới");
      return;
    }

    router.replace("/login");

  };

  return(

    <View style={styles.container}>

      <Text style={styles.title}>Mật khẩu mới</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu mới của bạn"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

container:{
  flex:1,
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:"#D79AA3"
},

title:{
  fontSize:22,
  fontWeight:"bold",
  marginBottom:20
},

input:{
  width:"80%",
  backgroundColor:"#fff",
  padding:12,
  borderRadius:25
},

button:{
  marginTop:25,
  backgroundColor:"black",
  padding:15,
  borderRadius:30,
  width:200,
  alignItems:"center"
},

buttonText:{
  color:"white",
  fontWeight:"bold",
  fontSize:16
}

});