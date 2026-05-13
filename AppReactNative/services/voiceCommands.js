export const processVoiceCommand = (text) => {

  const command =
    text.toLowerCase().trim();

  // =========================
  // NORMALIZE
  // =========================

  const normalized = command
    .replace(/ga ra/g, "gara")
    .replace(/ga ga/g, "gara")
    .replace(/ra ra/g, "gara")
    .replace(/gala/g, "gara")
    .replace(/\s+/g, " ");

  console.log(
    "🎤 Voice:",
    normalized
  );

  // =====================================================
  // ƯU TIÊN CÂU CỤ THỂ TRƯỚC
  // =====================================================

  // =========================
  // ĐÈN PHÒNG KHÁCH ON
  // =========================

  if (
    normalized.includes("sofa") ||
    normalized.includes(
      "bật đèn phòng khách"
    )
  ) {

    return {
      toggle_light_1: true,
    };

  }

  // =========================
  // ĐÈN PHÒNG KHÁCH OFF
  // =========================

  if (
    normalized.includes(
      "tắt đèn phòng khách"
    )
  ) {

    return {
      toggle_light_1: false,
    };

  }

  // =========================
  // ĐÈN PHÒNG NGỦ ON
  // =========================

  if (
    normalized.includes("sleep") ||
    normalized.includes(
      "bật đèn phòng ngủ"
    )
  ) {

    return {
      toggle_light_2: true,
    };

  }

  // =========================
  // ĐÈN PHÒNG NGỦ OFF
  // =========================

  if (
    normalized.includes(
      "tắt đèn phòng ngủ"
    )
  ) {

    return {
      toggle_light_2: false,
    };

  }

  // =========================
  // ĐÈN GARA ON
  // =========================

  if (
    normalized.includes("car") ||
    normalized.includes(
      "bật đèn gara"
    )
  ) {

    return {
      toggle_light_3: true,
    };

  }

  // =========================
  // ĐÈN GARA OFF
  // =========================

  if (
    normalized.includes(
      "tắt đèn gara"
    )
  ) {

    return {
      toggle_light_3: false,
    };

  }

  // =========================
  // BẬT TOÀN BỘ ĐÈN
  // =========================

  if (
    normalized.includes("open") ||
    normalized.includes("bật đèn")
  ) {

    return {
      toggle_light_1: true,
      toggle_light_2: true,
      toggle_light_3: true,
    };

  }

  // =========================
  // TẮT TOÀN BỘ ĐÈN
  // =========================

  if (
    normalized.includes("light on") ||
    normalized.includes("tắt đèn")
  ) {

    return {
      toggle_light_1: false,
      toggle_light_2: false,
      toggle_light_3: false,
    };

  }

  // =========================
  // MỞ CỬA
  // =========================

  if (
    normalized.includes(
      "open door"
    ) ||
    normalized.includes(
      "mở cửa"
    ) ||
    normalized.includes(
      "gâu gâu gâu"
    )
  ) {

    return {
      open_door: true,
    };

  }

  // =========================
  // ĐÓNG CỬA
  // =========================

  if (
    normalized.includes(
      "close door"
    ) ||
    normalized.includes(
      "đóng cửa"
    )
  ) {

    return {
      open_door: false,
    };

  }

  // =========================
  // MỞ GARA
  // =========================

  if (
    normalized.includes(
      "chicken"
    ) ||
    normalized.includes(
      "mở gara"
    )
  ) {

    return {
      open_garage: true,
    };

  }

  // =========================
  // ĐÓNG GARA
  // =========================

  if (
    normalized.includes(
      "duck"
    ) ||
    normalized.includes(
      "đóng gara"
    )
  ) {

    return {
      open_garage: false,
    };

  }

  // =========================
  // KHÔNG HIỂU
  // =========================

  return null;

};

