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

import {
  useState,
  useEffect,
  useRef
} from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  ref,
  onValue,
  set
} from "firebase/database";

import { db } from "../../services/firebaseConfig";

export default function ControlScreen() {

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
  // LOG
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

      // LIGHT 1
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
          value
            ? "on"
            : "off"
        );

      }

      // LIGHT 2
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
          value
            ? "on"
            : "off"
        );

      }

      // LIGHT 3
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
          value
            ? "on"
            : "off"
        );

      }

      // MAIN DOOR
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

      // GARAGE
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

      // AUTO GARAGE
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
        .replace(/ra ra/g, "gara")
        .replace(/gala/g, "gara")
        .replace(/ga-da/g, "gara")
        .replace(/mở ga ra/g, "mở gara")
        .replace(/đóng ga ra/g, "đóng gara")
        .replace(/\s+/g, " ");

    voiceLog(
      "Nội dung nhận diện:",
      normalized
    );

    // =========================
    // LIVING ROOM LIGHT ON
    // =========================

    if (
      normalized.includes("sofa") ||
      normalized.includes("bật đèn phòng khách")
    ) {

      await sendCommand(
        "toggle_light_1",
        true
      );

      return;

    }

    // =========================
    // LIVING ROOM LIGHT OFF
    // =========================

    if (
      normalized.includes("one") ||
      normalized.includes("tắt đèn phòng khách")
    ) {

      await sendCommand(
        "toggle_light_1",
        false
      );

      return;

    }

    // =========================
    // BEDROOM LIGHT ON
    // =========================

    if (
      normalized.includes("sleep") ||
      normalized.includes("bật đèn phòng ngủ")
    ) {

      await sendCommand(
        "toggle_light_2",
        true
      );

      return;

    }

    // =========================
    // BEDROOM LIGHT OFF
    // =========================

    if (
      normalized.includes("two") ||
      normalized.includes("tắt đèn phòng ngủ")
    ) {

      await sendCommand(
        "toggle_light_2",
        false
      );

      return;

    }

    // =========================
    // GARAGE LIGHT ON
    // =========================

    if (
      normalized.includes("car") ||
      normalized.includes("bật đèn ga ra") ||
      normalized.includes("bật đèn gara")
    ) {

      await sendCommand(
        "toggle_light_3",
        true
      );

      return;

    }

    // =========================
    // GARAGE LIGHT OFF
    // =========================

    if (
      normalized.includes("three") ||
      normalized.includes("tắt đèn ga ra") ||
      normalized.includes("tắt đèn gara")
    ) {

      await sendCommand(
        "toggle_light_3",
        false
      );

      return;

    }

    // =========================
    // ALL LIGHTS ON
    // =========================

    if (
      normalized === "open" ||
      normalized === "bật"
    ) {

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
    // ALL LIGHTS OFF
    // =========================

    if (
      normalized === "light on" ||
      normalized === "tắt"
    ) {

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
    // OPEN DOOR
    // =========================

    if (
      normalized.includes("gâu gâu gâu") ||
      normalized.includes("open door") ||
      normalized.includes("mở cửa")
    ) {

      await sendCommand(
        "open_door",
        true
      );

      return;

    }

    // =========================
    // CLOSE DOOR
    // =========================

    if (
      normalized.includes("bye") ||
      normalized.includes("close door") ||
      normalized.includes("đóng cửa")
    ) {

      await sendCommand(
        "open_door",
        false
      );

      return;

    }

    // =========================
    // OPEN GARAGE
    // =========================

    if (
      normalized.includes("xe") ||
      normalized.includes("chicken") ||
      normalized.includes("mở gara")
    ) {

      await sendCommand(
        "open_garage",
        true
      );

      return;

    }

    // =========================
    // CLOSE GARAGE
    // =========================

    if (
      normalized.includes("đóng") ||
      normalized.includes("duck") ||
      normalized.includes("đóng gara")
    ) {

      await sendCommand(
        "open_garage",
        false
      );

      return;

    }

    voiceLog(
      "⚠️ Không hiểu câu lệnh"
    );

  };

  // =========================
  // START VOICE
  // =========================

  const startVoiceRecognition = () => {

    try {

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

      recog.maxAlternatives = 5;

      recog.onstart = () => {

        setIsRecording(true);

      };

      recog.onend = () => {

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

          if (data.door) {

            setOpenMainDoor(
              data.door.status ===
                "open" ||
              data.door.status ===
                "opened"
            );

          }

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
        Trạng thái: {value
          ? onText
          : offText}
      </Text>

      <Switch
        value={value}
        onValueChange={setValue}
      />

    </View>

  );

  return (

    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >

      <Text style={styles.title}>
        Smart Home Control
      </Text>

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

          <Text style={styles.buttonText}>
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
    backgroundColor: "#D79AA3",
    paddingVertical: 40
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333"
  },

  box: {
    backgroundColor: "#C6908F",
    width: "90%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center"
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff"
  },

  status: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 10
  },

  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center"
  },

  input: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10
  },

  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }

});
