import { settings } from "../config";
import { rxjsaxios } from "../utils";

const unicodeWeatherIcons = {
  clear: "\u2600",
  rain: "\uFE0F",
  cloud: "\u2601",
  snow: "\u2744",
  thunder: "\u26C8",
  fog: "\u1F32B",
  default: "\u1F321",
};

const getWeatherFromGeo = (latitude, longitude) => {
  const weatherApis = settings.weather.getWeatherApis(latitude, longitude);
  console.log(latitude, longitude, weatherApis);
  return rxjsaxios.getMethod(weatherApis[0]).pipe();
};

const generateWeatherUnicode = (weatherWord) => {
  weatherWord = weatherWord.toLowerCase();
  const weatherIcons = Object.keys(unicodeWeatherIcons);
  let weatherWordKey = unicodeWeatherIcons.default;
  for (const weather of weatherIcons) {
    if (weatherWord.indexOf(weather) != -1) {
      weatherWordKey = weather;
      break;
    }
  }
  return unicodeWeatherIcons[weatherWordKey];
};

export default { getWeatherFromGeo, generateWeatherUnicode };
