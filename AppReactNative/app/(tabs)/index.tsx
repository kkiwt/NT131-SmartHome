import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { ref, onValue } from "firebase/database";
import { db } from "../../services/firebaseConfig";

const screenWidth = Dimensions.get("window").width;

export default function StatusScreen(){

  const [temp,setTemp] = useState(20);
  const [humidity,setHumidity] = useState(50);
  const [history, setHistory] = useState<{temp: number, hum: number}[]>([]);

  useEffect(()=>{

    // 🔥 Listen to temperature changes
    const tempRef = ref(db, 'smarthome/sensors/temperature');
    const unsubscribeTemp = onValue(tempRef, (snap)=>{
      const newTemp = snap.val() || 20;
      setTemp(newTemp);

      setHistory(prev => {
        const updated = [...prev, { temp: newTemp, hum: prev[prev.length - 1]?.hum || 50 }];
        if(updated.length > 20) updated.shift();
        return updated;
      });
    });

    // 🔥 Listen to humidity changes
    const humRef = ref(db, 'smarthome/sensors/humidity');
    const unsubscribeHum = onValue(humRef, (snap)=>{
      const newHum = snap.val() || 50;
      setHumidity(newHum);

      setHistory(prev => {
        const updated = [...prev];
        if(updated.length > 0){
          updated[updated.length - 1].hum = newHum;
        } else {
          updated.push({ temp: 20, hum: newHum });
        }
        if(updated.length > 20) updated.shift();
        return updated;
      });
    });

    return ()=>{
      unsubscribeTemp();
      unsubscribeHum();
    };

  },[]);

  const tempData = history.map(item => item.temp);
  const humData = history.map(item => item.hum);
  const labels = history.map((_, i) => i.toString());

  return(

    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Thông số môi trường</Text>


      <View style={styles.rowBox}>
        
        <View style={styles.textBox}>
          <Text style={styles.smallText}>
            Nhiệt độ
          </Text>
          <Text style={styles.valueText}>
            {temp} °C
          </Text>
        </View>

        {history.length > 0 && (
          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: tempData }]
            }}
            width={screenWidth * 0.45}
            height={120}
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#C6908F",
              backgroundGradientFrom: "#C6908F",
              backgroundGradientTo: "#C6908F",
              decimalPlaces: 0,
              color: () => `red`,
              labelColor: () => "#000"
            }}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            style={styles.chart}
          />
        )}

      </View>


      <View style={styles.rowBox}>
        
        <View style={styles.textBox}>
          <Text style={styles.smallText}>
            Độ ẩm
          </Text>
          <Text style={styles.valueText}>
            {humidity} %
          </Text>
        </View>

        {history.length > 0 && (
          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: humData }]
            }}
            width={screenWidth * 0.45}
            height={120}
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#C6908F",
              backgroundGradientFrom: "#C6908F",
              backgroundGradientTo: "#C6908F",
              decimalPlaces: 0,
              color: () => `blue`,
              labelColor: () => "#000"
            }}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            style={styles.chart}
          />
        )}

      </View>

    </ScrollView>

  );
}

const styles = StyleSheet.create({

container:{
  flexGrow:1,
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:"#D79AA3"
},

title:{
  fontSize:22,
  fontWeight:"bold",
  marginBottom:30
},


rowBox:{
  flexDirection:"row",
  backgroundColor:"#C6908F",
  borderRadius:20,
  marginBottom:20,
  width:"90%",
  padding:15,
  alignItems:"center",
  justifyContent:"space-between"
},

textBox:{
  justifyContent:"center"
},

smallText:{
  fontSize:14,
  color:"#333"
},

valueText:{
  fontSize:20,
  fontWeight:"bold"
},

chart:{
  borderRadius:10
}

});