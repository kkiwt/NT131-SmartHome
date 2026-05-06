const mqtt = require('mqtt');
const admin = require('firebase-admin');

// 1. Cấu hình Firebase
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smart-home-8fedd-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.database();

// 2. Cấu hình MQTT Broker
const client = mqtt.connect("mqtt://52.184.80.222", {
    port: 1883, 
    username: "esp32user", 
    password: "esp32password",
    clientId: 'gateway_kkiwt_sync_' + Math.random().toString(16).substring(2, 6),
    protocolId: 'MQIsdp', 
    protocolVersion: 3
});

// ==========================================
// CHIỀU 1: FIREBASE COMMANDS -> MQTT (ĐIỀU KHIỂN)
// ==========================================
db.ref("smarthome/commands").on("child_changed", (snapshot) => {
    const key = snapshot.key;
    const value = snapshot.val();
    
    // Đồng nhất dữ liệu gửi xuống ESP32 (ON/OFF)
    const payload = typeof value === 'boolean' ? (value ? "ON" : "OFF") : value.toString();
    client.publish(`smarthome/commands/${key}`, payload, { qos: 1 });

    let devicePath = "";
    let statusText = "";

    // Ánh xạ lệnh từ App sang trạng thái thiết bị trong Database
    switch(key) {
        case "open_door":
            devicePath = "devices/door";
            statusText = value ? "open" : "closed";
            break;

        case "open_garage": // Đã sửa lại cho gọn
            devicePath = "devices/garage_door";
            statusText = value ? "open" : "closed";
            break;
        case "unlock_door": 
            devicePath = "devices/door_lock_main"; 
            statusText = value ? "unlocked" : "locked"; 
            break;

        case "toggle_sprinkler": 
            devicePath = "devices/sprinkler"; 
            statusText = value ? "active" : "inactive"; 
            break;

        case "toggle_light_1": 
            devicePath = "devices/lights/light_1"; 
            statusText = value ? "on" : "off"; 
            break;
            
        case "open_garage": 
            if(value === true) { 
                devicePath = "devices/garage_door"; 
                statusText = "opening"; 
                db.ref("smarthome/commands/close_garage").set(false);
            } 
            break;

        case "close_garage": 
            if(value === true) { 
                devicePath = "devices/garage_door"; 
                statusText = "closed"; 
                db.ref("smarthome/commands/open_garage").set(false);
            } 
            break;
    }

    // Cập nhật trạng thái hiển thị trên App ngay khi có lệnh
    if (devicePath && statusText) {
        db.ref(`smarthome/${devicePath}`).update({ 
            status: statusText, 
            last_updated: Date.now() 
        });
        console.log(`📡 [App -> MQTT] Lệnh: ${key} | Sync: ${statusText.toUpperCase()}`);
    }
});

// ==========================================
// CHIỀU 2: MQTT -> FIREBASE (CẬP NHẬT THỰC TẾ)
// ==========================================
client.on('connect', () => {
    console.log("🚀 Gateway Online: Đã kết nối Broker 52.184.80.222");
    client.subscribe("smarthome/#");
});

client.on('message', (topic, message) => {
    const msg = message.toString().toLowerCase();
    const parts = topic.split('/'); 
    if (parts[0] !== "smarthome" || parts.length < 2) return;

    const rootNode = parts[1]; 
    const subNode = parts[2];  

    // 1. Lưu Logs PIR (Cảm biến chuyển động)
    // Khớp với code ESP32 gửi lên smarthome/sensors/pir
    if (rootNode === "sensors" && subNode === "pir") {
        db.ref("smarthome/sensors/pir").push({
            value: "DETECTED",
            timestamp: Date.now()
        });
        console.log("⚠️ [Alert] Phát hiện chuyển động tại cửa!");
        return;
    }

    // 2. Lưu Logs RFID
    if (rootNode === "sensors" && subNode === "rfid") {
        db.ref("smarthome/sensors/rfid_logs").push({
            uid: message.toString().toUpperCase(),
            timestamp: Date.now()
        });
        console.log(`🔑 [Security] Thẻ RFID: ${message.toString().toUpperCase()}`);
        return;
    }

    // 3. Reverse Sync (Đồng bộ ngược trạng thái thiết bị)
    if (rootNode === "devices") {
        const devicePath = parts.slice(1).join('/'); 
        const deviceKey = parts[parts.length - 1];

        // Cập nhật tình trạng thiết bị thực tế
        db.ref(`smarthome/${devicePath}`).update({
            status: msg,
            last_updated: Date.now()
        });

        // Đảm bảo nút gạt trên App khớp với trạng thái vật lý
        if (deviceKey === "door") {
            db.ref("smarthome/commands/open_door").set(msg === "open");
        } 

        else if (deviceKey === "garage" || deviceKey === "garage_door") { // Thêm cái này
            db.ref("smarthome/commands/open_garage").set(msg === "open");
        }
        else if (deviceKey === "door_lock_main") {
            db.ref("smarthome/commands/unlock_door").set(msg === "unlocked");
        }
        else if (deviceKey === "sprinkler") {
            db.ref("smarthome/commands/toggle_sprinkler").set(msg === "active" || msg === "on");
        }
        else if (deviceKey === "light_1") {
            db.ref("smarthome/commands/toggle_light_1").set(msg === "on");
        }
        
        console.log(`🔄 [Device -> App] Đồng bộ trạng thái ${deviceKey}: ${msg}`);
    }
});