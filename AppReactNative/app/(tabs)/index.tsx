import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

export default function StatusScreen(){

  const [temp,setTemp] = useState(20);
  const [humidity,setHumidity] = useState(50);

  useEffect(()=>{

    const interval = setInterval(()=>{

      setTemp(Math.floor(Math.random()*99)+1);
      setHumidity(Math.floor(Math.random()*99)+1);

    },2000);

    return ()=>clearInterval(interval);

  },[]);

  return(

    <View style={styles.container}>

      <Text style={styles.title}>Thông số môi trường</Text>

      <View style={styles.box}>
        <Text style={styles.text}>
          Nhiệt độ : {temp} °C
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.text}>
          Độ ẩm : {humidity} %
        </Text>
      </View>

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
  marginBottom:30
},

box:{
  backgroundColor:"#C6908F",
  padding:20,
  borderRadius:20,
  marginBottom:20,
  width:"70%",
  alignItems:"center"
},

text:{
  fontSize:20,
  fontWeight:"bold"
}

});