const openGeoLocationApis = [
  `https://sys.airtel.lv/ip2country/__ipAddress__/?full=true`,
  "https://freegeoip.app/json/",
];

const getGeoLocationApis = (ipAddress) => {
  return openGeoLocationApis.map((api) =>
    api.replace("__ipAddress__", ipAddress)
  );
};

export default {
  getGeoLocationApis,
};
