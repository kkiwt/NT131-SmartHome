import { View, Text, StyleSheet } from "react-native";

export default function NotificationScreen(){

  const messages = [
    "BÁO ĐỘNG!!! CÓ CHÁY KÍCH HOẠT HỆ THỐNG CHỮA CHÁY",
    "CỬA ĐÃ ĐƯỢC MỞ KHOÁ",
    "GHI NHẬN CHUYỂN ĐỘNG NHIỀU TRƯỚC CỬA"
  ];

  const randomMessage = () =>{
    return messages[Math.floor(Math.random()*messages.length)];
  }

  return(

    <View style={styles.container}>

      <Text style={styles.title}>Thông báo</Text>

      <View style={styles.box}>
        <Text style={styles.text}>{randomMessage()}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.text}>{randomMessage()}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.text}>{randomMessage()}</Text>
      </View>

    </View>

  );

}

const styles = StyleSheet.create({

container:{
  flex:1,
  alignItems:"center",
  justifyContent:"center",
  backgroundColor:"#D79AA3"
},

title:{
  fontSize:22,
  fontWeight:"bold",
  marginBottom:30
},

box:{
  backgroundColor:"#C6908F",
  width:"85%",
  padding:20,
  borderRadius:20,
  marginBottom:20
},

text:{
  fontWeight:"bold",
  fontSize:16
}

});