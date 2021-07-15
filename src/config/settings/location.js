const openGeoLocationApis = [
  {
    id: "airtel",
    url: "https://sys.airtel.lv/ip2country/__ipAddress__/?full=true",
  },
  { id: "freegeoip", url: "https://freegeoip.app/json/" },
];

const getGeoLocationApis = (ipAddress) => {
  return openGeoLocationApis.map(({ id, url }) => ({
    id,
    url: url.replace("__ipAddress__", ipAddress),
  }));
};

export default {
  getGeoLocationApis,
};
