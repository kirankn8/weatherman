import { ipAddressSources } from "../constants/ipaddress";
import { locationSources } from "../constants/location";
import { weatherSources } from "../constants/weather";
import axios from "./axios";

const serviceSettings = {
  weather: {
    dailyForecastSource: weatherSources._7timer_Civil,
    weeklyForecastSource: weatherSources._7timer_CivilLight,
    frequencyInHrs: 24,
  },
  ipAddress: {
    ipAddressSource: ipAddressSources.ipfy,
  },
  location: {
    locationSource: locationSources.airtel,
  },
};

export { serviceSettings };

export default { axios, serviceSettings };
