import { map } from "rxjs";
import { rxjsaxios } from "../utils";
import { weatherAdapter } from "../utils/adpaters";
import { weather } from "../config/constants";
import { serviceSettings } from "../config/settings";

const getDailyWeatherForecast = (latitude, longitude) => {
  const api = weather.getWeatherApi(
    serviceSettings.weather.dailyForecastSource,
    latitude,
    longitude
  );
  return rxjsaxios
    .getMethod(api)
    .pipe(map(weatherAdapter[serviceSettings.weather.dailyForecastSource]));
};

const getWeeklyWeatherForecast = (latitude, longitude) => {
  const api = weather.getWeatherApi(
    serviceSettings.weather.weeklyForecastSource,
    latitude,
    longitude
  );
  return rxjsaxios
    .getMethod(api)
    .pipe(map(weatherAdapter[serviceSettings.weather.weeklyForecastSource]));
};

const generateWeatherUnicode = (weatherWord = "") => {
  weatherWord = weatherWord.toLowerCase();
  weatherWord = weatherWord.replace(/\s/g, "");
  const weatherIcons = Object.keys(weather.weatherEmojis);
  let weatherWordKey = weather.weatherEmojis.default.unicode;
  for (const weather of weatherIcons) {
    if (weatherWord.indexOf(weather) != -1) {
      weatherWordKey = weather;
      break;
    }
  }
  return weather.weatherEmojis[weatherWordKey].unicode;
};

const getNext4WeatherUpdates = (time, weatherForecasts) => {
  // TODO: logic need to be reviewed based on storage of forecast in vscode
  const currentTime = new Date(time);
  let i = 0;
  for (; i < weatherForecasts.length; i++) {
    const time = new Date(weatherForecasts[i].time);
    if (time > currentTime) break;
  }
  return weatherForecasts.slice(i, i + 4);
};

export default {
  getDailyWeatherForecast,
  getWeeklyWeatherForecast,
  generateWeatherUnicode,
  getNext4WeatherUpdates,
};
