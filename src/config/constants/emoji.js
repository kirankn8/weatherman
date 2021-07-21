const u = (code) => {
  return String.fromCodePoint(code);
};

export const emojiConstants = {
  RAIN: "rain",
  CLEAR: "clear",
  THUNDER: "thunder",
  SNOW: "snow",
  WAITING: "waiting",
  DEFAULT: "default",
  THERMOMETER: "thermometer",
};

export const weatherManEmojis = {
  clear: { unicode: u(0x1f60e), animate: "animate__bounce", name: "clear" },
  fog: { unicode: u(0x1f32b), animate: "animate__bounce", name: "fog" },
  partly: { unicode: u(0x26c5), animate: "animate__shakeX", name: "cloudy" },
  cloud: { unicode: u(0x2601), animate: "animate__shakeX", name: "cloudy" },
  rain: { unicode: u(0x1f327), animate: "animate__headShake", name: "rain" },
  shower: { unicode: u(0x1f327), animate: "animate__headShake", name: "rain" },
  snow: { unicode: u(0x2744), animate: "animate__flash", name: "snow" },
  ts: { unicode: u(0x26c8), animate: "animate__shakeY", name: "thunder" },
  thunder: { unicode: u(0x26c8), animate: "animate__shakeY", name: "thunder" },
  gale: { unicode: u(0x1f4a8), animate: "animate__shakeX", name: "gale" },
  storm: { unicode: u(0x1f32a), animate: "animate__shakeX", name: "storm" },
  hurricane: {
    unicode: u(0x1f32a),
    animate: "animate__shakeX",
    name: "hurricane",
  },
  cyclone: { unicode: u(0x1f300), animate: "animate__shakeX", name: "cyclone" },
  waiting: { unicode: u(0x23f3), animate: "", name: "" },
  temperature: { unicode: u(0x1f321), animate: "", name: "" },
  thermometer: { unicode: u(0x1f321), animate: "", name: "" },
  location: { unicode: u(0x1f4cd), animate: "", name: "" },
  default: { unicode: u(0x1f321), animate: "", name: "" },
};
