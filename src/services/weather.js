import { map, min } from "rxjs";
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

const generateWeatherEmoji = (weatherWord = "") => {
  weatherWord = weatherWord.toLowerCase();
  weatherWord = weatherWord.replace(/\s/g, "");
  if (weather.weatherEmojis[weatherWord]) {
    return weather.weatherEmojis[weatherWord];
  }
  const weatherIcons = Object.keys(weather.weatherEmojis);
  let weatherWordKey = "default";
  for (const weather of weatherIcons) {
    if (weatherWord.indexOf(weather) != -1) {
      weatherWordKey = weather;
      break;
    }
  }
  return weather.weatherEmojis[weatherWordKey];
};

const getNextNWeatherUpdates = (weatherForecasts, n) => {
  // TODO: logic need to be reviewed based on storage of forecast in vscode
  const currentTime = new Date();
  let i = 0;
  for (; i < weatherForecasts.length; i++) {
    const time = new Date(weatherForecasts[i].time);
    if (time > currentTime) break;
  }
  return weatherForecasts.slice(i, i + n);
};

const getCurrentWeatherUpdate = (weatherForecasts) => {
  const currentTime = new Date();
  let i = 0;
  for (; i < weatherForecasts.length; i++) {
    const time = new Date(weatherForecasts[i].time);
    if (time > currentTime) break;
  }
  return i == 0 ? weatherForecasts[0] : weatherForecasts[i - 1];
};

const isUmbrellaRequired = (weatherForecasts) => {
  const currentTime = new Date();
  let i = 0;
  for (; i < weatherForecasts.length; i++) {
    const time = new Date(weatherForecasts[i].time);
    if (time > currentTime) break;
  }

  let isClearWeather = true;
  for (let j = i; j < Math.min(weatherForecasts.length, 12); j++) {
    const { name: weatherName } = generateWeatherEmoji(
      weatherForecasts[j].weather
    );
    if (["rain", "thunder", "snow"].includes(weatherName)) {
      return weather.getQnA(
        weatherName,
        weatherForecasts[j].weather,
        weatherForecasts[j].time
      );
    }
    if (weatherName !== "clear") {
      isClearWeather = false;
    }
  }

  return weather.getQnA(
    isClearWeather ? "clear" : "default",
    weatherForecasts[i].weather,
    weatherForecasts[i].time
  );
};

export default {
  getDailyWeatherForecast,
  getWeeklyWeatherForecast,
  generateWeatherEmoji,
  getNextNWeatherUpdates,
  getCurrentWeatherUpdate,
  isUmbrellaRequired,
};
