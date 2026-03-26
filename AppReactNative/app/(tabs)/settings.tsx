import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { auth, db } from "../../services/firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function SettingsScreen(){

  const [profile,setProfile] = useState<any>(null);

  useEffect(()=>{

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const profileRef = ref(db,"users/"+uid+"/profile");

    const unsubscribe = onValue(profileRef,(snap)=>{
      setProfile(snap.val());
    });

    return () => unsubscribe();

  },[]);

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  return (

    <View style={styles.container}>

      {profile && (
        <>
          <Image
            source={{
              uri: profile.avatar || "https://via.placeholder.com/150"
            }}
            style={styles.avatar}
          />

          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.gender}>{profile.gender}</Text>
        </>
      )}

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

  avatar:{
    width:120,
    height:120,
    borderRadius:60,
    marginBottom:15
  },

  name:{
    fontSize:20,
    fontWeight:"bold"
  },

  gender:{
    marginBottom:40
  },

  button:{
    position:"absolute",
    bottom:40,
    right:20,
    backgroundColor:"black",
    padding:15,
    borderRadius:30
  },

  buttonText:{
    color:"white",
    fontWeight:"bold"
  }

});