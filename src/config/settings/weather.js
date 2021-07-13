const openWeatherApis = [
  `http://www.7timer.info/bin/api.pl?lon=__longitude__&lat=__latitude__&product=civillight&output=json`,
];

const getWeatherApis = (latitude, longitude) => {
  return openWeatherApis.map((api) => {
    api.replace("__latitude__", latitude);
    api.replace("__longitude__", longitude);
    return api;
  });
};

export default {
  getWeatherApis,
};
