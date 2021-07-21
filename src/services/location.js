// @ts-nocheck
import { rxjsaxios } from "../utils";
import { map } from "rxjs";
import { locationAdapter } from "../utils/adpaters";
import { location } from "../config/constants";
import { extensionSettings } from "../config/settings/extension";

const serviceSettings = extensionSettings.services;

const getGeoLocation = (ipAddress) => {
  const api = location.getGeoLocationApi(
    serviceSettings.location.locationSource,
    ipAddress
  );
  return rxjsaxios
    .getMethod(api)
    .pipe(map(locationAdapter[serviceSettings.location.locationSource]));
};

export default { getGeoLocation };
