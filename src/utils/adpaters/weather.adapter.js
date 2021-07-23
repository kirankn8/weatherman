import { weatherSources } from "../../config/constants/weather";

const _7timerweatherMappings = {
  mcloudy: "Cloudy",
  ts: "Thunderstorm",
  tsnight: "Thunderstorm",
  tsday: "Thunderstorm",
  tsrain: "Thunderstorm with rain",
  tsrainday: "Thunderstorm Day with rain",
  tsrainnight: "Thunderstorm Night with rain",
  clearday: "Clear Day",
  clearnight: "Clear Night",
  pcloudyday: "Partly Cloudy Day",
  pcloudynight: "Partly Cloudy Night",
  mcloudyday: "Cloudy Day",
  mcloudynight: "Cloudy Night",
  cloudyday: "Cloudy Day",
  cloudynight: "Cloudy Night",
  humidday: "Humid Day",
  humidnight: "Humid Night",
  lightrainday: "Light Rain Day",
  lightrainnight: "Light Rain Night",
  oshowerday: "Ocassional Showers Day",
  oshowernight: "Ocassional Showers Night",
  ishowerday: "Isolated showers Day",
  ishowernight: "Isolated showers Night",
  lightsnowday: "Light Snow Day",
  lightsnownight: "Light Snow Night",
  rainday: "Rain",
  rainnight: "Rain",
  snowday: "Snow",
  snownight: "Snow",
  rainsnowday: "Rain with Snow",
  rainsnownight: "Rain with Snow",
};

const _7timerCivil = ({ init, dataseries = [] }) => {
  init = init.toString();
  const year = init.slice(0, 4);
  const month = init.slice(4, 6);
  const date = init.slice(6, 8);
  const hour = init.slice(8, 10);
  const time = new Date(year, month - 1, date, hour).getTime();

  const getPredictions = ({
    cloudcover,
    lifted_index,
    rh2m,
    prec_amount,
    windSpeed,
  }) => {
    const predictions = [];
    const cloudCovers = {
      1: "Clear",
      2: "Clear",
      3: "Partly Cloudy",
      4: "Partly Cloudy",
      5: "Partly Cloudy",
      6: "Cloudy",
      7: "Cloudy",
      8: "Very Cloudy",
      9: "Very Cloudy",
    };
    predictions.push(cloudCovers[cloudcover]);
    if (rh2m >= 90 && cloudcover <= 6) predictions.push("Foggy");
    if (prec_amount < 4 && cloudcover >= 8)
      predictions.push("Light rain or showers");
    if (prec_amount < 4 && cloudcover >= 6 && cloudcover <= 7)
      predictions.push("Occasional showers");
    if (prec_amount < 4 && cloudcover < 6) predictions.push("Isolated showers");
    if (prec_amount < 4) predictions.push("Light or occasional snow");
    if (prec_amount >= 4) predictions.push("Rain/Snow");
    if (prec_amount < 4 && lifted_index <= -6)
      predictions.push("Thunderstorm possible");
    if (prec_amount >= 4 && lifted_index <= -6)
      predictions.push("Thunderstorm");
    if (windSpeed >= 5) predictions.push("Windy");

    return predictions;
  };

  const getPrecipitationType = (type) => {
    const types = {
      frzr: "freezing rain",
      icep: "ice pellets",
    };
    return types[type] || type;
  };

  const getWindSpeed = (windSpeed) => {
    const speedMap = {
      1: "Below 0.3m/s (calm)",
      2: "0.3-3.4m/s (light)",
      3: "3.4-8.0m/s (moderate)",
      4: "8.0-10.8m/s (fresh)",
      5: "10.8-17.2m/s (strong)",
      6: "17.2-24.5m/s (gale)",
      7: "24.5-32.6m/s (storm)",
      8: "Over 32.6m/s (hurricane)",
    };
    return speedMap[windSpeed];
  };

  const windDirection = {
    N: "North",
    NE: "North-East",
    SE: "South-East",
    S: "South",
    SW: "South-West",
    E: "East",
    W: "West",
    NW: "North-West",
  };

  return dataseries.map(
    ({
      timepoint,
      cloudcover,
      lifted_index,
      prec_type,
      prec_amount,
      temp2m,
      rh2m,
      wind10m,
      weather,
    }) => {
      const timestamp = new Date(time);
      timestamp.setHours(timestamp.getHours() + timepoint);
      return {
        timestamp: timestamp.getTime(),
        temperature: `${temp2m}°C`,
        weather: _7timerweatherMappings[weather] || weather,
        wind: `${windDirection[wind10m.direction]} ${getWindSpeed(
          wind10m.speed
        )}`,
        precipitationType: getPrecipitationType(prec_type),
        predictions: getPredictions({
          cloudcover,
          lifted_index,
          rh2m,
          prec_amount,
          windSpeed: wind10m.speed,
        }),
      };
    }
  );
};

const _7timerCivilLight = ({ dataseries }) => {
  const getDate = (time) => {
    time = time.toString();
    const year = time.slice(0, 4);
    const month = time.slice(4, 6);
    const date = time.slice(6, 8);
    return new Date(year, month - 1, date).getTime();
  };

  const getWindSpeed = (windSpeed) => {
    const speedMap = {
      1: "Below 0.3m/s (calm)",
      2: "0.3-3.4m/s (light)",
      3: "3.4-8.0m/s (moderate)",
      4: "8.0-10.8m/s (fresh)",
      5: "10.8-17.2m/s (strong)",
      6: "17.2-24.5m/s (gale)",
      7: "24.5-32.6m/s (storm)",
      8: "Over 32.6m/s (hurricane)",
    };
    return speedMap[windSpeed];
  };

  return dataseries.map(({ date, weather, temp2m, wind10m_max }) => {
    const timestamp = getDate(date);
    return {
      timestamp: timestamp,
      temperature: `Max: ${temp2m.max}°C, Min: ${temp2m.min}°C`,
      weather: _7timerweatherMappings[weather] || weather,
      wind: `${getWindSpeed(wind10m_max)}`,
    };
  });
};

export default {
  [weatherSources._7timer_Civil]: _7timerCivil,
  [weatherSources._7timer_CivilLight]: _7timerCivilLight,
};
