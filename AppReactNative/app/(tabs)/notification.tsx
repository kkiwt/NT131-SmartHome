import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function NotificationScreen() {

  const notifications = [
    {
      title: "CỬA GARA",
      message: "ĐÃ ĐƯỢC MỞ",
      time: "10:30"
    },
    {
      title: "CỬA CHÍNH",
      message: "ĐÃ ĐƯỢC MỞ",
      time: "11:05"
    },
    {
      title: "CẢM BIẾN",
      message: "PHÁT HIỆN CHUYỂN ĐỘNG",
      time: "11:10"
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.header}>Thông báo</Text>

      {notifications.map((item, index) => (
        <View key={index} style={styles.box}>

          {/* Heading 1 */}
          <Text style={styles.title}>
            {item.title}
          </Text>

          {/* Heading 2 */}
          <Text style={styles.message}>
            {item.message} VÀO LÚC {item.time}
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