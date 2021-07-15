import { settings } from "../config/";
import { rxjsaxios } from "../utils";
import { map } from "rxjs";
import adapter from "../utils/adpaters";

const getGeoLocation = (ipAddress) => {
  const geoLocationsApis = settings.location.getGeoLocationApis(ipAddress);
  return rxjsaxios
    .getMethod(geoLocationsApis[0].url)
    .pipe(
      map((geoLocation) =>
        adapter.locationAdapter[geoLocationsApis[0].id](geoLocation)
      )
    );
};

export default { getGeoLocation };
