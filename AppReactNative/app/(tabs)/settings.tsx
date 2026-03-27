import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  Modal, TextInput, Alert, FlatList
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { auth, db } from "../../services/firebaseConfig";
import { ref, onValue, set, get, update, remove } from "firebase/database";

export default function SettingsScreen(){

  const [profile,setProfile] = useState<any>(null);
  const [isOwner,setIsOwner] = useState(false);

  const [createModal,setCreateModal] = useState(false);
  const [joinModal,setJoinModal] = useState(false);
  const [approveModal,setApproveModal] = useState(false);

  const [houseId,setHouseId] = useState("");
  const [houseName,setHouseName] = useState("");
  const [houseAddress,setHouseAddress] = useState("");

  const [joinId,setJoinId] = useState("");

  const [requests,setRequests] = useState<any[]>([]);

  const uid = auth.currentUser?.uid;

  // 🔥 LOAD PROFILE
  useEffect(()=>{
    if (!uid) return;

    const profileRef = ref(db,"users/"+uid+"/profile");

    return onValue(profileRef,(snap)=>{
      const data = snap.val();
      setProfile(data);
      setIsOwner(data?.role === "owner");
    });
  },[]);

  // 🔥 LOAD REQUEST (FIX NULL)
  useEffect(()=>{
    if(!profile || !profile.houseId || !isOwner) return;

    const reqRef = ref(db,`houses/${profile.houseId}/requests`);

    return onValue(reqRef, async (snap)=>{
      const data = snap.val();

      if(!data){
        setRequests([]);
        return;
      }

      const uids = Object.keys(data);

      const list = await Promise.all(
        uids.map(async (id)=>{
          const userSnap = await get(ref(db,`users/${id}/profile`));
          return { uid:id, ...userSnap.val() };
        })
      );

      setRequests(list);
    });

  },[profile]);

  // 🔥 CREATE HOUSE
  const handleCreate = async ()=>{
    if(!houseId){
      Alert.alert("Lỗi","Nhập ID nhà");
      return;
    }

    await set(ref(db,"houses/"+houseId),{
      name: houseName,
      address: houseAddress,
      owner: uid
    });

    await update(ref(db,"users/"+uid+"/profile"),{
      role:"owner",
      houseId,
      address: houseAddress
    });

    // update local state ngay
    setProfile((prev:any)=>({
      ...prev,
      role:"owner",
      houseId,
      address: houseAddress
    }));

    setIsOwner(true);

    setCreateModal(false);
    Alert.alert("Đã tạo nhà");
  };

  // 🔥 JOIN
  const handleJoin = async ()=>{
    const snap = await get(ref(db,"houses/"+joinId));

    if(!snap.exists()){
      Alert.alert("ID không tồn tại");
      return;
    }

    await set(ref(db,`houses/${joinId}/requests/${uid}`), true);

    Alert.alert("Đã gửi yêu cầu");
    setJoinModal(false);
  };

  // 🔥 APPROVE (FIX NULL)
  const handleApprove = async (user:any)=>{
    const house = profile?.houseId;
    if(!house) return;

    await set(ref(db,`houses/${house}/members/${user.uid}`),true);

    await update(ref(db,`users/${user.uid}/profile`),{
      houseId: house,
      address: profile.address
    });

    await remove(ref(db,`houses/${house}/requests/${user.uid}`));
  };

  const handleLogout = ()=>{
    router.replace("/(auth)/login");
  };

  // 🔥 GUARD PROFILE (FIX CRASH)
  if (!profile) {
    return null;
  }

  return(
    <View style={styles.container}>

      {/* TOP BUTTON */}
      <View style={styles.topRight}>
        <TouchableOpacity style={styles.topBtnBox} onPress={()=>setCreateModal(true)}>
          <Text style={styles.topBtn}>Tạo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.topBtnBox} onPress={()=>setJoinModal(true)}>
          <Text style={styles.topBtn}>Tham gia</Text>
        </TouchableOpacity>
      </View>

      {/* PROFILE */}
      <Image source={{uri: profile.avatar}} style={styles.avatar}/>

      <View style={styles.row}>
        <Text>Họ Tên : {profile.name}</Text>
        <Text>Giới tính: {profile.gender}</Text>
      </View>

      <Text style={styles.address}>
        Địa chỉ nhà: {profile.address || "Chưa có"}
      </Text>

      {/* APPROVE BUTTON */}
      {isOwner && (
        <TouchableOpacity style={styles.approveBtn} onPress={()=>setApproveModal(true)}>
          <Text style={{color:"white"}}>Duyệt</Text>
        </TouchableOpacity>
      )}

      {/* LOGOUT */}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={{color:"white"}}>Đăng xuất</Text>
      </TouchableOpacity>

      {/* CREATE MODAL */}
      <Modal visible={createModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <TextInput placeholder="Tên nhà" style={styles.input} onChangeText={setHouseName}/>
            <TextInput placeholder="ID" style={styles.input} onChangeText={setHouseId}/>
            <TextInput placeholder="Địa chỉ" style={styles.input} onChangeText={setHouseAddress}/>
            <TouchableOpacity style={styles.modalBtn} onPress={handleCreate}>
              <Text style={{color:"white"}}>Tạo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* JOIN MODAL */}
      <Modal visible={joinModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <TextInput placeholder="Nhập ID" style={styles.input} onChangeText={setJoinId}/>
            <TouchableOpacity style={styles.modalBtn} onPress={handleJoin}>
              <Text style={{color:"white"}}>Tham gia</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* APPROVE MODAL */}
      <Modal visible={approveModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>

            <FlatList
              data={requests}
              keyExtractor={(item)=>item.uid}
              renderItem={({item})=>(
                <View style={styles.requestItem}>
                  <Text>{item.name}</Text>
                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={()=>handleApprove(item)}
                  >
                    <Text style={{color:"white"}}>Duyệt</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

container:{
  flex:1,
  backgroundColor:"#D79AA3",
  paddingTop:80,
  alignItems:"center"
},

topRight:{
  position:"absolute",
  top:40,
  right:20,
  flexDirection:"row",
  gap:10
},

topBtnBox:{
  backgroundColor:"black",
  padding:10,
  borderRadius:10
},

topBtn:{ color:"white" },

avatar:{
  width:120,
  height:120,
  borderRadius:60,
  marginBottom:20
},

row:{
  flexDirection:"row",
  width:"90%",
  justifyContent:"space-between"
},

address:{
  marginTop:10,
  width:"90%"
},

button:{
  position:"absolute",
  bottom:40,
  right:20,
  backgroundColor:"black",
  padding:15,
  borderRadius:30
},

approveBtn:{
  position:"absolute",
  bottom:100,
  right:20,
  backgroundColor:"black",
  padding:15,
  borderRadius:30
},

modalContainer:{
  flex:1,
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:"rgba(0,0,0,0.5)"
},

modalBox:{
  width:"80%",
  backgroundColor:"white",
  padding:20,
  borderRadius:20
},

input:{
  borderWidth:1,
  marginBottom:10,
  padding:10,
  borderRadius:10
},

modalBtn:{
  backgroundColor:"black",
  padding:10,
  borderRadius:10,
  alignItems:"center",
  marginTop:10
},

requestItem:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginBottom:10,
  alignItems:"center"
}

});