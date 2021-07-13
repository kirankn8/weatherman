import { weather } from "../../config/settings";
import { rxjsaxios } from "../../utils";

const getWeather = (latitude, longitude) => {
  const weatherApis = weather.getWeatherApis(latitude, longitude);
  return rxjsaxios.getMethod(weatherApis[0]);
};

export default { getWeather };
