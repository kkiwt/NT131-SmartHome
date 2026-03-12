import { View, Text, StyleSheet } from "react-native";

export default function ControlScreen(){

  return(

    <View style={styles.container}>
      <Text style={styles.text}>Trang điều khiển thiết bị</Text>
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

text:{
  fontSize:20,
  fontWeight:"bold"
}

});