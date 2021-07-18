import { ipAddressSources } from "../../config/constants/ipaddress";

const ipfyAdapter = ({ ip }) => ip;

export default {
  [ipAddressSources.ipfy]: ipfyAdapter,
};
