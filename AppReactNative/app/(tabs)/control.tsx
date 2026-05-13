import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";

import { useState, useEffect, useRef } from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  ref,
  onValue,
  set
} from "firebase/database";

import { db } from "../../services/firebaseConfig";

export default function ControlScreen() {

  // =========================
  // STATES
  // =========================

  const [openMainDoor, setOpenMainDoor] =
    useState(false);

  const [openGarageDoor, setOpenGarageDoor] =
    useState(false);

  const [livingLight, setLivingLight] =
    useState(false);

  const [bedroomLight, setBedroomLight] =
    useState(false);

  const [garageLight, setGarageLight] =
    useState(false);

  const [autoGarage, setAutoGarage] =
    useState(false);

  const [isRecording, setIsRecording] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const recognitionRef =
    useRef<any>(null);

  // =========================
  // LOG FUNCTION
  // =========================

  const voiceLog = (
    title: string,
    data?: any
  ) => {

    console.log(
      `🎤 ${title}`,
      data || ""
    );

  };

  // =========================
  // FIREBASE COMMAND
  // =========================

  const sendCommand = async (
    commandPath: string,
    value: any
  ) => {

    try {

      voiceLog(
        "Gửi lệnh:",
        {
          commandPath,
          value
        }
      );

      // =========================
      // LIGHT 1
      // =========================

      if (
        commandPath === "toggle_light_1"
      ) {

        await set(
          ref(
            db,
            "smarthome/commands/toggle_light_1"
          ),
          value
        );

        await set(
          ref(
            db,
            "smarthome/devices/lights/light_1/status"
          ),
          value ? "on" : "off"
        );

      }

      // =========================
      // LIGHT 2
      // =========================

      else if (
        commandPath === "toggle_light_2"
      ) {

        await set(
          ref(
            db,
            "smarthome/commands/toggle_light_2"
          ),
          value
        );

        await set(
          ref(
            db,
            "smarthome/devices/lights/light_2/status"
          ),
          value ? "on" : "off"
        );

      }

      // =========================
      // LIGHT 3
      // =========================

      else if (
        commandPath === "toggle_light_3"
      ) {

        await set(
          ref(
            db,
            "smarthome/commands/toggle_light_3"
          ),
          value
        );

        await set(
          ref(
            db,
            "smarthome/devices/lights/light_3/status"
          ),
          value ? "on" : "off"
        );

      }

      // =========================
      // MAIN DOOR
      // =========================

      else if (
        commandPath === "open_door"
      ) {

        await set(
          ref(
            db,
            "smarthome/commands/open_door"
          ),
          value
        );

        await set(
          ref(
            db,
            "smarthome/devices/door/status"
          ),
          value
            ? "opened"
            : "closed"
        );

      }

      // =========================
      // GARAGE
      // =========================

      else if (
        commandPath === "open_garage"
      ) {

        await set(
          ref(
            db,
            "smarthome/commands/open_garage"
          ),
          value
        );

        await set(
          ref(
            db,
            "smarthome/devices/garage_door/status"
          ),
          value
            ? "opened"
            : "closed"
        );

      }

      // =========================
      // AUTO GARAGE
      // =========================

      else if (
        commandPath === "enable_auto_garage"
      ) {

        await set(
          ref(
            db,
            "smarthome/commands/enable_auto_garage"
          ),
          value
        );

        await set(
          ref(
            db,
            "smarthome/devices/garage_door/auto_mode"
          ),
          value
        );

      }

      voiceLog(
        "Firebase cập nhật thành công"
      );

    } catch (error) {

      console.error(
        "❌ Lỗi gửi lệnh:",
        error
      );

    }

  };

  // =========================
  // HANDLE VOICE COMMAND
  // =========================

  const handleVoiceCommand = async (
    text: string
  ) => {

    const normalized =
      text
        .toLowerCase()
        .trim()
        .replace(/ga ra/g, "gara")
        .replace(/ga ga/g, "gara")
        .replace(/ra ra/g, "gara");

    voiceLog(
      "Nội dung nhận diện:",
      normalized
    );

    // =========================
    // BẬT TOÀN BỘ ĐÈN
    // =========================

    if (
      normalized.includes("bật đèn")
    ) {

      voiceLog(
        "Đã hiểu: BẬT TOÀN BỘ ĐÈN"
      );

      await sendCommand(
        "toggle_light_1",
        true
      );

      await sendCommand(
        "toggle_light_2",
        true
      );

      await sendCommand(
        "toggle_light_3",
        true
      );

      return;

    }

    // =========================
    // TẮT TOÀN BỘ ĐÈN
    // =========================

    if (
      normalized.includes("tắt đèn")
    ) {

      voiceLog(
        "Đã hiểu: TẮT TOÀN BỘ ĐÈN"
      );

      await sendCommand(
        "toggle_light_1",
        false
      );

      await sendCommand(
        "toggle_light_2",
        false
      );

      await sendCommand(
        "toggle_light_3",
        false
      );

      return;

    }

    // =========================
    // ĐÈN PHÒNG KHÁCH
    // =========================

    if (
      normalized.includes(
        "bật đèn phòng khách"
      )
    ) {

      voiceLog(
        "Đã hiểu: BẬT ĐÈN PHÒNG KHÁCH"
      );

      await sendCommand(
        "toggle_light_1",
        true
      );

      return;

    }

    if (
      normalized.includes(
        "tắt đèn phòng khách"
      )
    ) {

      voiceLog(
        "Đã hiểu: TẮT ĐÈN PHÒNG KHÁCH"
      );

      await sendCommand(
        "toggle_light_1",
        false
      );

      return;

    }

    // =========================
    // ĐÈN PHÒNG NGỦ
    // =========================

    if (
      normalized.includes(
        "bật đèn phòng ngủ"
      )
    ) {

      voiceLog(
        "Đã hiểu: BẬT ĐÈN PHÒNG NGỦ"
      );

      await sendCommand(
        "toggle_light_2",
        true
      );

      return;

    }

    if (
      normalized.includes(
        "tắt đèn phòng ngủ"
      )
    ) {

      voiceLog(
        "Đã hiểu: TẮT ĐÈN PHÒNG NGỦ"
      );

      await sendCommand(
        "toggle_light_2",
        false
      );

      return;

    }

    // =========================
    // ĐÈN GARA
    // =========================

    if (
      normalized.includes(
        "bật đèn gara"
      )
    ) {

      voiceLog(
        "Đã hiểu: BẬT ĐÈN GARA"
      );

      await sendCommand(
        "toggle_light_3",
        true
      );

      return;

    }

    if (
      normalized.includes(
        "tắt đèn gara"
      )
    ) {

      voiceLog(
        "Đã hiểu: TẮT ĐÈN GARA"
      );

      await sendCommand(
        "toggle_light_3",
        false
      );

      return;

    }

    // =========================
    // CỬA CHÍNH
    // =========================

    if (
      normalized.includes("mở cửa")
    ) {

      voiceLog(
        "Đã hiểu: MỞ CỬA"
      );

      await sendCommand(
        "open_door",
        true
      );

      return;

    }

    if (
      normalized.includes("đóng cửa")
    ) {

      voiceLog(
        "Đã hiểu: ĐÓNG CỬA"
      );

      await sendCommand(
        "open_door",
        false
      );

      return;

    }

    // =========================
    // GARA
    // =========================

    if (
      normalized.includes(
        "mở gara"
      )
    ) {

      voiceLog(
        "Đã hiểu: MỞ GARA"
      );

      await sendCommand(
        "open_garage",
        true
      );

      return;

    }

    if (
      normalized.includes(
        "đóng gara"
      )
    ) {

      voiceLog(
        "Đã hiểu: ĐÓNG GARA"
      );

      await sendCommand(
        "open_garage",
        false
      );

      return;

    }

    // =========================
    // KHÔNG NHẬN DIỆN ĐƯỢC
    // =========================

    voiceLog(
      "⚠️ Không hiểu câu lệnh"
    );

  };

  // =========================
  // START VOICE
  // =========================

  const startVoiceRecognition = () => {

    try {

      voiceLog(
        "Bắt đầu ghi âm..."
      );

      const SpeechRecognition =
        (window as any)
          .SpeechRecognition ||
        (window as any)
          .webkitSpeechRecognition;

      if (!SpeechRecognition) {

        Alert.alert(
          "Lỗi",
          "Browser không hỗ trợ voice"
        );

        return;

      }

      // =========================
      // STOP CÁI CŨ NẾU CÓ
      // =========================

      if (
        recognitionRef.current
      ) {

        recognitionRef.current.stop();

      }

      const recog =
        new SpeechRecognition();

      recog.lang = "vi-VN";

      recog.continuous = true;

      recog.interimResults = true;

      recog.maxAlternatives = 1;

      recog.onstart = () => {

        voiceLog(
          "Microphone ON"
        );

        setIsRecording(true);

      };

      recog.onend = () => {

        voiceLog(
          "Microphone OFF"
        );

        setIsRecording(false);

      };

      recog.onerror = (
        event: any
      ) => {

        console.error(
          "❌ Voice Error:",
          event.error
        );

        setIsRecording(false);

      };

      // =========================
      // REALTIME RESULT
      // =========================

      recog.onresult = async (
        event: any
      ) => {

        let finalTranscript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {

          const transcript =
            event.results[i][0]
              .transcript;

          const isFinal =
            event.results[i].isFinal;

          voiceLog(
            isFinal
              ? "FINAL"
              : "LISTENING",
            transcript
          );

          if (isFinal) {

            finalTranscript +=
              transcript;

          }

        }

        // =========================
        // XỬ LÝ KHI CÓ CÂU HOÀN CHỈNH
        // =========================

        if (
          finalTranscript.trim()
        ) {

          await handleVoiceCommand(
            finalTranscript
          );

        }

      };

      recognitionRef.current =
        recog;

      recog.start();

    } catch (error) {

      console.error(
        "❌ Voice Start Error:",
        error
      );

    }

  };

  // =========================
  // STOP VOICE
  // =========================

  const stopVoiceRecognition = () => {

    voiceLog(
      "Dừng ghi âm"
    );

    if (
      recognitionRef.current
    ) {

      recognitionRef.current.stop();

    }

  };

  // =========================
  // HANDLERS
  // =========================

  const toggleOpenMainDoor = (
    val: boolean
  ) => {

    sendCommand(
      "open_door",
      val
    );

  };

  const toggleOpenGarageDoor = (
    val: boolean
  ) => {

    sendCommand(
      "open_garage",
      val
    );

  };

  const toggleLivingLight = (
    val: boolean
  ) => {

    sendCommand(
      "toggle_light_1",
      val
    );

  };

  const toggleBedroomLight = (
    val: boolean
  ) => {

    sendCommand(
      "toggle_light_2",
      val
    );

  };

  const toggleGarageLight = (
    val: boolean
  ) => {

    sendCommand(
      "toggle_light_3",
      val
    );

  };

  const toggleAutoGarage = (
    val: boolean
  ) => {

    sendCommand(
      "enable_auto_garage",
      val
    );

  };

  // =========================
  // FIREBASE REALTIME
  // =========================

  useEffect(() => {

    const devicesRef =
      ref(
        db,
        "smarthome/devices"
      );

    const unsubscribe =
      onValue(
        devicesRef,
        (snap) => {

          const data =
            snap.val();

          if (!data) return;

          // DOOR

          if (data.door) {

            setOpenMainDoor(
              data.door.status ===
                "open" ||
              data.door.status ===
                "opened"
            );

          }

          // GARAGE

          if (
            data.garage_door
          ) {

            setOpenGarageDoor(
              data.garage_door
                .status ===
                "open" ||
                data.garage_door
                  .status ===
                  "opened"
            );

            setAutoGarage(
              data.garage_door
                .auto_mode === true
            );

          }

          // LIGHTS

          const lights =
            data.lights;

          if (lights) {

            if (
              lights.light_1
            ) {

              setLivingLight(
                lights.light_1
                  .status === "on"
              );

            }

            if (
              lights.light_2
            ) {

              setBedroomLight(
                lights.light_2
                  .status === "on"
              );

            }

            if (
              lights.light_3
            ) {

              setGarageLight(
                lights.light_3
                  .status === "on"
              );

            }

          }

        }
      );

    return () => {

      unsubscribe();

      if (
        recognitionRef.current
      ) {

        recognitionRef.current.stop();

      }

    };

  }, []);

  // =========================
  // PASSWORD
  // =========================

  const handleChangePassword = () => {

    if (!password) {

      Alert.alert(
        "Lỗi",
        "Vui lòng nhập mật khẩu"
      );

      return;

    }

    Alert.alert(
      "Xác nhận",
      "Đổi mật khẩu?",
      [
        {
          text: "Huỷ"
        },
        {
          text: "OK",
          onPress: () => {

            setPassword("");

            Alert.alert(
              "Thành công"
            );

          }
        }
      ]
    );

  };

  // =========================
  // RENDER ITEM
  // =========================

  const renderItem = (
    title: string,
    value: boolean,
    setValue: (
      v: boolean
    ) => void,
    onText: string,
    offText: string
  ) => (

    <View style={styles.box}>

      <Text style={styles.label}>
        {title}
      </Text>

      <Text style={styles.status}>
        Trạng thái:
        {" "}
        {value
          ? onText
          : offText}
      </Text>

      <Switch
        value={value}
        onValueChange={setValue}
      />

    </View>

  );

  // =========================
  // UI
  // =========================

  return (

    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >

      <Text style={styles.title}>
        Smart Home Control
      </Text>

      {/* VOICE */}

      <View style={styles.box}>

        <Text style={styles.label}>
          Voice Control
        </Text>

        <TouchableOpacity
          style={[
            styles.voiceButton,
            {
              backgroundColor:
                isRecording
                  ? "#ff4d4d"
                  : "#4CAF50"
            }
          ]}
          onPressIn={
            startVoiceRecognition
          }
          onPressOut={
            stopVoiceRecognition
          }
          activeOpacity={0.8}
        >

          <Ionicons
            name="mic"
            size={35}
            color="#fff"
          />

        </TouchableOpacity>

        <Text style={styles.status}>
          {
            isRecording
              ? "🎤 Đang nghe..."
              : "Giữ để nói"
          }
        </Text>

      </View>

      {/* DEVICES */}

      {renderItem(
        "Mở Cửa Chính",
        openMainDoor,
        toggleOpenMainDoor,
        "Đang Mở",
        "Đã Đóng"
      )}

      {renderItem(
        "Mở Cửa Gara",
        openGarageDoor,
        toggleOpenGarageDoor,
        "Đang Mở",
        "Đã Đóng"
      )}

      {renderItem(
        "Đèn Phòng Khách",
        livingLight,
        toggleLivingLight,
        "Đang Bật",
        "Đang Tắt"
      )}

      {renderItem(
        "Đèn Phòng Ngủ",
        bedroomLight,
        toggleBedroomLight,
        "Đang Bật",
        "Đang Tắt"
      )}

      {renderItem(
        "Đèn Gara",
        garageLight,
        toggleGarageLight,
        "Đang Bật",
        "Đang Tắt"
      )}

      {/* AUTO GARAGE */}

      <View style={styles.box}>

        <Text style={styles.label}>
          Tự động Gara
        </Text>

        <Switch
          value={autoGarage}
          onValueChange={
            toggleAutoGarage
          }
        />

      </View>

      {/* PASSWORD */}

      <View style={styles.box}>

        <Text style={styles.label}>
          Đổi mật khẩu
        </Text>

        <TextInput
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={
            setPassword
          }
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={
            handleChangePassword
          }
        >

          <Text
            style={
              styles.buttonText
            }
          >
            Cập nhật
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor:
      "#D79AA3",
    paddingVertical: 40
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333"
  },

  box: {
    backgroundColor:
      "#C6908F",
    width: "85%",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    elevation: 4
  },

  label: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff"
  },

  status: {
    marginVertical: 5,
    color: "#eee"
  },

  input: {
    backgroundColor:
      "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  },

  button: {
    backgroundColor:
      "#444",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },

  voiceButton: {
    width: 85,
    height: 85,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  }

});