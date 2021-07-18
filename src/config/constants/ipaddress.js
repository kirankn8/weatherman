const ipAddressSources = {
  ipfy: "ipfy",
};

const ipAddressApis = {
  [ipAddressSources.ipfy]: "https://api64.ipify.org?format=json",
};

const getIpAddressApi = (id) => {
  return ipAddressApis[id];
};

export { ipAddressSources };
export default { ipAddressSources, getIpAddressApi };
