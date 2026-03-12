import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function SettingsScreen(){

  return(

    <View style={styles.container}>

      <TouchableOpacity
        style={styles.button}
        onPress={()=>router.replace("/auth/login")}
      >
        <Text style={styles.buttonText}>Đăng xuất</Text>
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

button:{
  backgroundColor:"black",
  padding:15,
  borderRadius:30,
  width:200,
  alignItems:"center"
},

buttonText:{
  color:"white",
  fontWeight:"bold"
}

});