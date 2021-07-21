import { retryBackoff } from "backoff-rxjs";
import { from, map } from "rxjs";
import { settings } from "../config";
import { extensionSettings } from "../config/settings/extension";

const { axios } = settings;

const getMethod = (url, config) => {
  return from(axios.get(url, config)).pipe(
    map((response) => response.data),
    retryBackoff({
      initialInterval: extensionSettings.services.retryStrategy.initalInterval,
      maxRetries: extensionSettings.services.retryStrategy.numberOfRetries,
      resetOnSuccess: extensionSettings.services.retryStrategy.resetOnSuccess,
    })
  );
};

const postMethod = (url, data, config) => {
  return from(axios.post(url, data, config)).pipe(
    map((response) => response.data),
    retryBackoff({
      initialInterval: extensionSettings.services.retryStrategy.initalInterval,
      maxRetries: extensionSettings.services.retryStrategy.numberOfRetries,
      resetOnSuccess: extensionSettings.services.retryStrategy.resetOnSuccess,
    })
  );
};

export default {
  getMethod,
  postMethod,
};
