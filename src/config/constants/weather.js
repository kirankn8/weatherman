const u = (code) => {
  return String.fromCodePoint(code);
};

const weatherSources = {
  _7timer_Civil: "7timer_Civil",
  _7timer_CivilLight: "7timer_CivilLight",
};

const weatherApis = {
  [weatherSources._7timer_Civil]: `https://www.7timer.info/bin/api.pl?lon=__longitude__&lat=__latitude__&product=civil&output=json`,
  [weatherSources._7timer_CivilLight]: `https://www.7timer.info/bin/api.pl?lon=__longitude__&lat=__latitude__&product=civillight&output=json`,
};

const getWeatherApi = (id, latitude, longitude) => {
  let url = weatherApis[id];
  url = url.replace("__latitude__", latitude);
  url = url.replace("__longitude__", longitude);
  return url;
};

const weatherEmojis = {
  clear: { unicode: u(0x1f60e), animate: "animate__bounce", name: "clear" },
  fog: { unicode: u(0x1f32b), animate: "animate__bounce", name: "fog" },
  partly: { unicode: u(0x26c5), animate: "animate__pulse", name: "cloudy" },
  cloud: { unicode: u(0x2601), animate: "animate__pulse", name: "cloudy" },
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

const weatherQnAConstants = {
  rain: {
    answer: "Yes.",
    details: "It is predicted to __weather__ at __time__",
  },
  thunder: {
    answer: "Definitely.",
    details: "It is predicted to __weather__ at __time__",
  },
  clear: {
    answer: "No.",
    details: "Unless you are worried about getting tanned ;)",
  },
  snow: {
    answer: "Maybe.",
    details: "It is predicted to __weather__ at __time__",
  },
  default: {
    answer: "Maybe.",
    details: "It is predicted to __weather__ at __time__",
  },
};

const getQnA = (id, weather, time) => {
  const qa = weatherQnAConstants[id] || weatherQnAConstants["default"];
  let details = qa.details.replace("__weather__", weather);
  details = details.replace("__time__", new Date(time).toDateString());
  return { answer: qa.answer, details };
};

export { weatherSources };
export default {
  weatherSources,
  weatherEmojis,
  getWeatherApi,
  getQnA,
};
