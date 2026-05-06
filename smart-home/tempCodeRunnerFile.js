const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://52.184.80.222:1883", {
  username: "esp32user",
  password: "esp32password",
  reconnectPeriod: 1000
});

client.on("connect", () => {
  console.log("✅ Connected MQTT");
  client.subscribe("home/#");
});

client.on("message", (topic, message) => {
  console.log("📩", topic, message.toString());
});

client.on("error", (err) => {
  console.log("❌ MQTT Error:", err.message);
});

client.on("close", () => {
  console.log("⚠️ Disconnected");
});

client.on("connect", () => {
  console.log("OK CONNECTED");
});

client.on("error", (e) => {
  console.log("ERROR:", e.message);
});