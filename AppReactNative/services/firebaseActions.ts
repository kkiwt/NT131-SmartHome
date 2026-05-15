import { ref, update } from "firebase/database";
import { db } from "./firebaseConfig";

export const turnOnAllLights = async () => {
  await update(ref(db, "/smarthome"), {
    toggle_light_1: true,
    toggle_light_2: true,
    toggle_light_3: true,
  });
};

export const turnOffAllLights = async () => {
  await update(ref(db, "/smarthome"), {
    toggle_light_1: false,
    toggle_light_2: false,
    toggle_light_3: false,
  });
};

export const livingRoomLightOn = async () => {
  await update(ref(db, "/smarthome"), {
    toggle_light_1: true,
  });
};

export const bedroomLightOn = async () => {
  await update(ref(db, "/smarthome"), {
    toggle_light_2: true,
  });
};

export const garageLightOn = async () => {
  await update(ref(db, "/smarthome"), {
    toggle_light_3: true,
  });
};

export const openDoor = async () => {
  await update(ref(db, "/smarthome"), {
    open_door: true,
  });
};

export const closeDoor = async () => {
  await update(ref(db, "/smarthome"), {
    open_door: false,
  });
};

export const openGarage = async () => {
  await update(ref(db, "/smarthome"), {
    open_garage: true,
  });
};

export const closeGarage = async () => {
  await update(ref(db, "/smarthome"), {
    open_garage: false,
  });
};