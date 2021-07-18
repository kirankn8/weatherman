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
  clear: { unicode: u(0x1f60e), animate: "animate__bounce" },
  cloudy: { unicode: u(0x2601), animate: "animate__pulse" },
  rain: { unicode: u(0x1f327), animate: "animate__headShake" },
  snow: { unicode: u(0x2744), animate: "animate__flash" },
  partly: { unicode: u(0x26c5), animate: "animate__pulse" },
  ts: { unicode: u(0x26c8), animate: "animate__shakeY" },
  thunder: { unicode: u(0x26c8), animate: "animate__shakeY" },
  waiting: { unicode: u(0x23f3), animate: "" },
  default: { unicode: u(0x1f321), animate: "" },
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

export { weatherSources };
export default {
  weatherSources,
  weatherEmojis,
  getWeatherApi,
  weatherQnAConstants,
};
