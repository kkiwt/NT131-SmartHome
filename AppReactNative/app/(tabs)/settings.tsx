import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function SettingsScreen(){

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>Cài đặt</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
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

title:{
  fontSize:22,
  fontWeight:"bold",
  marginBottom:30
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
  fontWeight:"bold",
  fontSize:16
}

});