import { from, map } from "rxjs";
import { settings } from "../config";

const { axios } = settings;

const getMethod = (url, config) => {
  return from(axios.get(url, config)).pipe(map((response) => response.data));
};

const postMethod = (url, data, config) => {
  return from(axios.post(url, data, config)).pipe(
    map((response) => response.data)
  );
};

export default {
  getMethod,
  postMethod,
};
