import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../services/firebaseConfig";

export default function NotificationScreen() {

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(()=>{
    // 🔥 Listen to notifications from Firebase
    const notifRef = ref(db, 'smarthome/notifications');
    
    return onValue(notifRef, (snap)=>{
      const data = snap.val();
      
      if(!data){
        setNotifications([]);
        return;
      }

      // Convert object to array and sort by timestamp (newest first)
      const notificationList = Object.entries(data).map(([key, value]: any) => ({
        id: key,
        ...value
      })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      setNotifications(notificationList);
    });
  },[]);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.header}>Thông báo</Text>

      {notifications.map((item, index) => (
        <View key={item.id || index} style={styles.box}>

          {/* Heading 1 */}
          <Text style={styles.title}>
            {item.title || item.type || "Thông báo"}
          </Text>

          {/* Heading 2 */}
          <Text style={styles.message}>
            {item.message || item.content || "Cập nhật"} {item.time || (item.timestamp ? new Date(item.timestamp).toLocaleTimeString('vi-VN') : "")}
          </Text>

        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D79AA3",
    paddingVertical: 20
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30
  },

  box: {
    backgroundColor: "#C6908F",
    width: "85%",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5
  },

  message: {
    fontSize: 14
  }

});