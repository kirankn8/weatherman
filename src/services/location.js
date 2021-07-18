import { rxjsaxios } from "../utils";
import { map, tap } from "rxjs";
import { locationAdapter } from "../utils/adpaters";
import { location } from "../config/constants";
import { serviceSettings } from "../config/settings";

const getGeoLocation = (ipAddress) => {
  const api = location.getGeoLocationApi(
    serviceSettings.location.locationSource,
    ipAddress
  );
  console.log(api);
  return rxjsaxios
    .getMethod(api)
    .pipe(map(locationAdapter[serviceSettings.location.locationSource]));
};

export default { getGeoLocation };
