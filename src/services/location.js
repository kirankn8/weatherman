import { settings } from "../config/";
import { rxjsaxios } from "../utils";

const getGeoLocation = (ipAddress) => {
  const geoLocationsApis = settings.location.getGeoLocationApis(ipAddress);
  return rxjsaxios.getMethod(geoLocationsApis[0]);
};

export default { getGeoLocation };
