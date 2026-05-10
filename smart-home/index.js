const mqtt = require('mqtt');
const admin = require('firebase-admin');
let isProcessingRFID = false; // Biến chặn quẹt thẻ liên tục

let loginAttempts = 0;       // Đếm số lần nhập sai
let isLocked = false;        // Trạng thái có đang bị khóa hay không
let lockUntil = 0;           // Thời điểm sẽ hết bị khóa (timestamp)

let garageCloseTimestamp = 0; // Lưu thời điểm sẽ đóng cửa
global.garageTimer = null;
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
    const payload = typeof value === 'boolean' ? (value ? "true" : "false") : value.toString();
    client.publish(`smarthome/commands/${key}`, payload, { qos: 1 });

    let devicePath = "";
    let statusText = "";

    // Ánh xạ lệnh từ App sang trạng thái thiết bị trong Database
// Thay thế đoạn switch(key) trong Backend của bạn
    switch(key) {
        case "open_door":
            devicePath = "devices/door";
            statusText = value ? "open" : "closed";
            // Khi mở cửa thì nên tự động kích hoạt lệnh unlock chốt luôn
            client.publish(`smarthome/commands/unlock_door`, value ? "true" : "false", { qos: 1 });
            break;

        case "open_garage":
            devicePath = "devices/garage_door";
            statusText = value ? "open" : "closed";
            break;

        case "toggle_sprinkler": 
            devicePath = "devices/sprinkler"; 
            statusText = value ? "active" : "inactive"; 
            break;

        case "toggle_light_1": 
            devicePath = "devices/lights/light_1"; 
            statusText = value ? "on" : "off"; 
            break;

        case "toggle_light_2": 
            devicePath = "devices/lights/light_2"; 
            statusText = value ? "on" : "off"; 
            break;
        case "toggle_light_3": 
            devicePath = "devices/lights/light_3"; 
            statusText = value ? "on" : "off"; 
                break;
        case "toggle_buzzer": 
                devicePath = "devices/buzzer_alarm"; 
                statusText = value ? "on" : "off"; 
        
        // Nếu bật còi (Báo cháy) -> Tự tạo Notification
            if (value) {
                db.ref("smarthome/notifications").push({
                    title: "CẢNH BÁO CHÁY",
                    message: "Phát hiện khói/nhiệt độ cao. Còi báo động đã kích hoạt!",
                    timestamp: Date.now(),
                    type: "danger",
                    read: false
            });
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
// HÀM GIÁM SÁT: CHECK TRỰC TIẾP TỪ NODE PIR
// ==========================================
/* const startGarageMonitor = () => {
    console.log("⏳ Bắt đầu giám sát an toàn Garage...");

    // Dùng .on('child_added') để lắng nghe mỗi khi có PIR mới push lên
    // Firebase sẽ tự đẩy dữ liệu về, mình không cần dùng setTimeout đi hỏi nữa
    const pirRef = db.ref("smarthome/sensors/pir").limitToLast(1);
    
    const listener = pirRef.on('child_added', (snapshot) => {
        const latestPIR = snapshot.val().value;
        const now = Date.now();
        const remaining = Math.ceil((garageCloseTimestamp - now) / 1000);

        // Nếu sắp đóng (còn dưới 5s) mà phát hiện xe/người
        if (remaining > 0 && remaining <= 5 && latestPIR === "DETECTED") {
            console.log(`⚠️ Sắp đóng (${remaining}s) nhưng có vật cản! +10s gia hạn.`);
            garageCloseTimestamp += 10000;
        }
    });
    */
/*
    // Vẫn cần một cái timer để chốt hạ việc đóng cửa khi HẾT thời gian
    const checkFinalClose = setInterval(() => {
        const now = Date.now();
        if (now >= garageCloseTimestamp) {
            console.log("🔒 An toàn. Đóng Garage.");
            db.ref("smarthome/commands").update({ open_garage: false });
            
            // Dọn dẹp: Tắt listener và tắt chính cái interval này
            pirRef.off('child_added', listener);
            clearInterval(checkFinalClose);
            global.garageTimer = null;
        }
    }, 1000);

    global.garageTimer = checkFinalClose;
}; */

// ==========================================
// CHIỀU 2: MQTT -> FIREBASE (CẬP NHẬT THỰC TẾ)
// ==========================================
// ==========================================
// ==========================================
// CHIỀU 2: MQTT -> FIREBASE (CẬP NHẬT THỰC TẾ)
// ==========================================
client.on('connect', () => {
    console.log("🚀 Gateway Online: Đã kết nối Broker 52.184.80.222");
    client.subscribe("smarthome/#");
});

client.on('message', (topic, message) => {
    const rawMsg = message.toString();
    const msg = rawMsg.toLowerCase();
    const parts = topic.split('/');
    if (parts[0] !== "smarthome" || parts.length < 3) return;

    const rootNode = parts[1]; // thường là "sensors" hoặc "devices"
    const subNode = parts[2];  // ví dụ: "pir", "rfid", "dht11_1"...

    if (rootNode === "sensors") {
        
        // --- 1. XỬ LÝ PIR (Lưu lịch sử - Push) ---
        if (subNode === "pir") {
            const detected = (msg === "on" || msg === "detected");
            console.log(`⚠️ PIR: ${detected ? "DETECTED" : "CLEAR"}`);
            db.ref("smarthome/sensors/pir").push({
                value: detected ? "DETECTED" : "CLEAR",
                timestamp: Date.now()
            });
            return; // Xong thì dừng
        }

        // --- 2. XỬ LÝ RFID (Lưu log + Tự mở cửa 10s) ---
        if (subNode === "rfid") {
            const rfidUID = rawMsg.toUpperCase();
            console.log(`🔑 [SECURITY] Thẻ RFID quẹt: ${rfidUID}`);

            // Lưu log quẹt thẻ
            db.ref("smarthome/sensors/rfid_logs").push({
                uid: rfidUID,
                timestamp: Date.now()
            });

            // Cập nhật giá trị thẻ mới nhất
            db.ref("smarthome/sensors/rfid").set({
                value: rfidUID,
                last_updated: Date.now()
            });

            // Automation mở cửa
            console.log("🔓 [AUTOMATION] Thẻ hợp lệ -> Mở cửa 10s...");
            db.ref("smarthome/commands").update({ open_door: true });

            setTimeout(() => {
                console.log("🔒 [AUTOMATION] Tự động đóng cửa.");
                db.ref("smarthome/commands").update({ open_door: false });
            }, 10000);
            return;
        }

        // --- 3. XỬ LÝ NUMPAD (Chống dò mã + Mở Garage 30s) ---
        if (subNode === "numpad") {
            const now = Date.now();

            // Kiểm tra trạng thái khóa (Brute force)
            if (isLocked) {
                if (now < lockUntil) {
                    const remaining = Math.ceil((lockUntil - now) / 1000);
                    console.log(`🚫 [AUTH] Đang bị khóa! Còn ${remaining}s.`);
                    client.publish("smarthome/commands/oled_msg", `Locked: ${remaining}s`);
                    return;
                } else {
                    isLocked = false;
                    loginAttempts = 0;
                    console.log("🔓 [AUTH] Đã hết thời gian chờ. Reset hệ thống.");
                }
            }

            const correctPass = "123456";
            if (rawMsg === correctPass) {
                console.log("✅ [AUTH] Mật khẩu đúng!");
                loginAttempts = 0;
                db.ref("smarthome/commands").update({ open_garage: true });

                if (global.garageTimer) clearTimeout(global.garageTimer);
                global.garageTimer = setTimeout(() => {
                    console.log("🔒 [TIMER] Tự động đóng Garage.");
                    db.ref("smarthome/commands").update({ open_garage: false });
                    global.garageTimer = null;
                }, 30000);
            } else {
                loginAttempts++;
                console.log(`❌ [AUTH] Sai lần ${loginAttempts}/5!`);
                if (loginAttempts >= 5) {
                    isLocked = true;
                    lockUntil = now + 30000;
                    db.ref("smarthome/security_alerts").push({
                        type: "BRUTE_FORCE_ATTEMPT",
                        timestamp: now
                    });
                }
            }
            return;
        }

// Cấu hình giới hạn số lượng bản ghi
const MAX_LOGS = 100;

// --- 4. CÁC CẢM BIẾN CÒN LẠI ---
if (subNode.includes("dht11") || subNode === "mq2") {
    const historyRef = db.ref(`smarthome/logs/sensor_history/${subNode}`);

    // 1. Đẩy dữ liệu mới lên
    historyRef.push({
        value: rawMsg,
        timestamp: Date.now()
    });
    console.log(`📊 [LOG] Cập nhật ${subNode}: ${rawMsg} tại ${new Date().toLocaleString()}`);
    // 2. Kiểm tra và dọn dẹp (Round Robin logic)
    historyRef.once('value', (snapshot) => {
        const count = snapshot.numChildren();
        
        if (count > MAX_LOGS) {
            // Tính số lượng cần xóa
            const numToDelete = count - MAX_LOGS;
            let i = 0;
            
            // Lấy danh sách các bản ghi cũ nhất (Firebase sắp xếp theo thời gian mặc định)
            snapshot.forEach((child) => {
                if (i < numToDelete) {
                    // Xóa bản ghi cũ
                    child.ref.remove();
                    i++;
                } else {
                    return true; // Dừng vòng lặp khi đã xóa đủ
                }
            });
            console.log(`🧹 [CLEANUP] Đã xóa ${numToDelete} bản ghi cũ của ${subNode}`);
        }
    });
}
    }

    // 3. Log Reverse Sync (Đồng bộ thiết bị)
    if (rootNode === "devices") {
        const devicePath = parts.slice(1).join('/'); 
        const deviceKey = parts[parts.length - 1];

        // Log trạng thái thiết bị báo về
        console.log(`🔄 [SYNC] Thiết bị báo về: ${deviceKey} ---> ${msg.toUpperCase()}`);

        db.ref(`smarthome/${devicePath}`).update({
            status: msg,
            last_updated: Date.now(),
            // console them value cua thiết bị nếu cần, ví dụ: value: rawMsg 
        });

        // Cập nhật ngược lên nút bấm (commands)
        if (deviceKey === "door") db.ref("smarthome/commands/open_door").set(msg === "open");
        else if (deviceKey === "garage_door") db.ref("smarthome/commands/open_garage").set(msg === "open");
        else if (deviceKey === "sprinkler") db.ref("smarthome/commands/toggle_sprinkler").set(msg === "active");
        else if (deviceKey === "light_1") db.ref("smarthome/commands/toggle_light_1").set(msg === "on");
    }
});