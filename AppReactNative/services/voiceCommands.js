export const processVoiceCommand = (text) => {
  const command = text.toLowerCase();

  // normalize tiếng Việt
  const normalized = command
    .replace(/ga ra/g, "gara")
    .replace(/ga ga/g, "gara")
    .replace(/ra ra/g, "gara");

  // ===== ĐÈN =====

  if (normalized.includes("bật đèn")) {
    return {
      toggle_light_1: true,
      toggle_light_2: true,
      toggle_light_3: true,
    };
  }

  if (normalized.includes("tắt đèn")) {
    return {
      toggle_light_1: false,
      toggle_light_2: false,
      toggle_light_3: false,
    };
  }

  if (normalized.includes("bật đèn phòng khách")) {
    return {
      toggle_light_1: true,
    };
  }

  if (normalized.includes("bật đèn phòng ngủ")) {
    return {
      toggle_light_2: true,
    };
  }

  if (normalized.includes("bật đèn gara")) {
    return {
      toggle_light_3: true,
    };
  }

  // ===== CỬA =====

  if (normalized.includes("mở cửa")) {
    return {
      open_door: true,
    };
  }

  if (normalized.includes("đóng cửa")) {
    return {
      open_door: false,
    };
  }

  // ===== GARAGE =====

  if (
    normalized.includes("mở gara") ||
    normalized.includes("mở ga ra")
  ) {
    return {
      open_garage: true,
    };
  }

  if (
    normalized.includes("đóng gara") ||
    normalized.includes("đóng ga ra")
  ) {
    return {
      open_garage: false,
    };
  }

  return null;
};