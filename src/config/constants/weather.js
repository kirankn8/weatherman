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
  url = url
    .replace("__latitude__", latitude)
    .replace("__longitude__", longitude);
  return url;
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
  let details = qa.details
    .replace("__weather__", weather)
    .replace("__time__", new Date(time).toLocaleString());
  return { answer: qa.answer, details };
};

export { weatherSources };
export default {
  weatherSources,
  getWeatherApi,
  getQnA,
};
