import { View, Text, StyleSheet, Switch } from "react-native";
import { useState } from "react";

export default function ControlScreen(){

  const [doorLocked,setDoorLocked] = useState(true);
  const [lightOn,setLightOn] = useState(false);

  return(

    <View style={styles.container}>

      <Text style={styles.title}>Điều khiển thiết bị</Text>

      {/* Khoá cửa */}
      <View style={styles.box}>

        <Text style={styles.label}>Khoá cửa</Text>

        <Text style={styles.status}>
          {doorLocked ? "Khoá" : "Mở Khoá"}
        </Text>

        <Switch
          value={doorLocked}
          onValueChange={setDoorLocked}
        />

      </View>


      {/* Đèn */}
      <View style={styles.box}>

        <Text style={styles.label}>Đèn</Text>

        <Text style={styles.status}>
          {lightOn ? "Mở đèn" : "Tắt đèn"}
        </Text>

        <Switch
          value={lightOn}
          onValueChange={setLightOn}
        />

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
  width:"80%",
  padding:20,
  borderRadius:20,
  marginBottom:20,
  alignItems:"center"
},

label:{
  fontSize:18,
  fontWeight:"bold",
  marginBottom:5
},

status:{
  marginBottom:10,
  fontSize:16
}

});