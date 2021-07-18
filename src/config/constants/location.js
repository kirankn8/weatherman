const locationSources = {
  airtel: "airtel",
  freegeoip: "freegeoip",
};

const locationApis = {
  [locationSources.airtel]:
    "https://sys.airtel.lv/ip2country/__ipAddress__/?full=true",
  [locationSources.freegeoip]: "https://freegeoip.app/json/",
};

const getGeoLocationApi = (id, ipAddress) => {
  const url = locationApis[id];
  return url.replace("__ipAddress__", ipAddress);
};

export { locationSources };
export default { locationSources, getGeoLocationApi };
