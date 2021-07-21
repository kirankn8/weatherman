// @ts-nocheck
import { ipaddress } from "../config/constants";
import { rxjsaxios } from "../utils";
import { ipaddressAdapter } from "../utils/adpaters";
import { map } from "rxjs";
import { extensionSettings } from "../config/settings/extension";

const serviceSettings = extensionSettings.services;

const getIpAddress = () => {
  const api = ipaddress.getIpAddressApi(
    serviceSettings.ipAddress.ipAddressSource
  );
  return rxjsaxios
    .getMethod(api)
    .pipe(map(ipaddressAdapter[serviceSettings.ipAddress.ipAddressSource]));
};

export default { getIpAddress };
