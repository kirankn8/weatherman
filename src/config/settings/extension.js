import { ipAddressSources } from "../constants/ipaddress";
import { locationSources } from "../constants/location";
import { weatherSources } from "../constants/weather";

export const extensionSettings = {
  viewType: "weatherMan",
  appName: "WeatherMan",
  invocationCmd: "weatherman.forecast",
  statusBarPriority: 0,
  webpackConfig: {
    outputDir: "dist",
    webviewJsFile: "bundle.js",
    webviewCssFile: "bundle.css",
    globalJsFile: "globals.js",
    weatherManIcon: "weatherman.png",
    htmlFile: "index.html",
    developmentServer: "http://localhost:8080",
  },
  storage: {
    weeklyForecast: "weeklyForecast",
    dailyForecast: "dailyForecast",
    location: "location",
  },
  services: {
    updateFrequencyInHrs: 0,
    retryStrategy: {
      numberOfRetries: 3,
      initalInterval: 100,
      resetOnSuccess: true,
    },
    weather: {
      dailyForecastSource: weatherSources._7timer_Civil,
      weeklyForecastSource: weatherSources._7timer_CivilLight,
    },
    ipAddress: {
      ipAddressSource: ipAddressSources.ipfy,
    },
    location: {
      locationSource: locationSources.airtel,
    },
  },
};
