import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRef, useState } from "react";

export default function OtpScreen(){

  const [otp,setOtp] = useState(["","","","","",""]);
  const inputs = useRef<any[]>([]);

  const handleChange = (text:string,index:number) => {

    if(!/^[0-9]?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if(text !== "" && index < 5){
      inputs.current[index+1].focus();
    }
  };

  const handleKeyPress = (e:any,index:number) => {

    if(e.nativeEvent.key === "Backspace"){

      if(otp[index] === "" && index > 0){
        inputs.current[index-1].focus();
      }

    }

  };

  const resendOtp = () => {

    Alert.alert("Thông báo","Đã gửi lại mã OTP");

    setOtp(["","","","","",""]);

    inputs.current[0].focus();
  };

  return(

    <View style={styles.container}>

      <Text style={styles.title}>
        Mã OTP đã được gửi đến Email của bạn !
      </Text>

      <Text style={styles.subtitle}>
        Kiểm tra Email và nhập OTP vào bên dưới :D
      </Text>

      <View style={styles.otpContainer}>

        {otp.map((digit,index)=>(
          <TextInput
            key={index}
            ref={ref => inputs.current[index] = ref}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text)=>handleChange(text,index)}
            onKeyPress={(e)=>handleKeyPress(e,index)}
          />
        ))}

      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resendOtp}>
        <Text style={styles.resend}>
          Chưa nhận được OTP? nhấn để gửi lại!
        </Text>
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
  fontSize:18,
  fontWeight:"bold",
  textAlign:"center",
  marginBottom:10
},

subtitle:{
  textAlign:"center",
  marginBottom:30
},

otpContainer:{
  flexDirection:"row",
  gap:10
},

otpInput:{
  width:45,
  height:50,
  backgroundColor:"#fff",
  borderRadius:10,
  textAlign:"center",
  fontSize:20
},

button:{
  marginTop:30,
  backgroundColor:"black",
  padding:15,
  borderRadius:25,
  width:200,
  alignItems:"center"
},

buttonText:{
  color:"white",
  fontWeight:"bold",
  fontSize:16
},

resend:{
  marginTop:20,
  textDecorationLine:"underline"
}

});