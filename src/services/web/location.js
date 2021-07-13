import { location } from "../../config/settings";
import { rxjsaxios } from "../../utils";

const getGeoLocation = (ipAddress) => {
  const geoLocationsApis = location.getGeoLocationApis(ipAddress);
  return rxjsaxios.getMethod(geoLocationsApis[0]);
};

export default { getGeoLocation };
