import { from } from "rxjs";
import { axios } from "../config/settings";

const getMethod = (url, config) => {
  return from(axios.get(url, config));
};

const postMethod = (url, data, config) => {
  return from(axios.post(url, data, config));
};

export default {
  getMethod,
  postMethod,
};
