
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "../../services/firebaseConfig";

const screenWidth = Dimensions.get("window").width;


export default function StatusScreen() {
  // ... các phần useEffect và State giữ nguyên như cũ
  const [history1, setHistory1] = useState<number[]>([]); // dht11_1
  const [history2, setHistory2] = useState<number[]>([]); // dht11_2
  const [historyMQ, setHistoryMQ] = useState<number[]>([]); // mq2

  useEffect(() => {
    // 1. Lấy dữ liệu cho DHT11_1
    const ref1 = query(ref(db, 'smarthome/logs/sensor_history/dht11_1'), limitToLast(15));
    const unsub1 = onValue(ref1, (snap) => {
      const data: number[] = [];
      snap.forEach((child) => {
        const val = child.val();
        data.push(parseFloat(val?.value) || 0);
      });
      setHistory1(data);
    });

    // 2. Lấy dữ liệu cho DHT11_2
    const ref2 = query(ref(db, 'smarthome/logs/sensor_history/dht11_2'), limitToLast(15));
    const unsub2 = onValue(ref2, (snap) => {
      const data: number[] = [];
      snap.forEach((child) => {
        const val = child.val();
        data.push(parseFloat(val?.value) || 0);
      });
      setHistory2(data);
    });

    // 3. Lấy dữ liệu cho MQ2
    const refMQ = query(ref(db, 'smarthome/logs/sensor_history/mq2'), limitToLast(15));
    const unsubMQ = onValue(refMQ, (snap) => {
      const data: number[] = [];
      snap.forEach((child) => {
        const val = child.val();
        data.push(parseFloat(val?.value) || 0);
      });
      setHistoryMQ(data);
    });

    return () => {
      unsub1(); unsub2(); unsubMQ();
    };
  }, []);

  // HÀM RENDER BIỂU ĐỒ: ép trục Y lên 150, line dày, nền tối neon (theo yêu cầu mới)
  const renderChart = (data: number[], color: string) => {
    const chartData = data.length > 0 ? data : [0];
    return (
      <LineChart
        data={{
          labels: data.map((_, i) => i.toString()),
          datasets: [
            {
              data: chartData,
              color: (opacity = 1) => color,
              strokeWidth: 3
            },
            {
              data: [150],
              color: () => "transparent",
              strokeWidth: 3
            }
          ]
        }}
        width={screenWidth * 0.9}
        height={220}
        chartConfig={{
          backgroundColor: "#8c5d5c",
          backgroundGradientFrom: "#8c5d5c",
          backgroundGradientTo: "#5e3a39",
          decimalPlaces: 0,
          color: (opacity = 1) => color,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForBackgroundLines: {
            strokeDasharray: "0",
            stroke: "rgba(255, 255, 255, 0.1)"
          }
        }}
        fromZero={true}
        segments={5}
        bezier
        style={styles.chart}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>GIÁM SÁT THỰC TẾ</Text>

      {/* BIỂU ĐỒ 1: DHT11_1 - Dùng màu TRẮNG cho nổi nhất */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
           <Text style={styles.cardTitle}>🌡️ Nhiệt độ Phòng ngủ (S1)</Text>
           <Text style={styles.liveValue}>{history1[history1.length - 1] || 0} °C</Text>
        </View>
        {renderChart(history1, "#FFFFFF")} 
      </View>

      {/* BIỂU ĐỒ 2: DHT11_2 - Dùng màu VÀNG NEON */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
           <Text style={styles.cardTitle}>🌡️ Nhiệt độ Garage (S2)</Text>
           <Text style={styles.liveValue}>{history2[history2.length - 1] || 0} °C</Text>
        </View>
        {renderChart(history2, "#EAFF00")}
      </View>

      {/* BIỂU ĐỒ 3: MQ2 - Dùng màu XANH CYAN */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
           <Text style={styles.cardTitle}>💨 Mức độ khói (MQ2)</Text>
           <Text style={styles.liveValue}>{historyMQ[historyMQ.length - 1] || 0}</Text>
        </View>
        {renderChart(historyMQ, "#00E5FF")}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "#D79AA3"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#fff",
    letterSpacing: 1
  },
  card: {
    backgroundColor: "#C6908F",
    borderRadius: 25,
    padding: 12,
    width: "95%",
    marginBottom: 20,
    // Đổ bóng mạnh hơn cho nổi khối
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  liveValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    borderRadius: 10
  },
  chart: {
    marginVertical: 5,
    borderRadius: 20
  }
});