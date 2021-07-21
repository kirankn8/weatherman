import { locationSources } from "../../config/constants/location";

const airtelLocationAdapter = ({ country, city, lat, lon }) => ({
  country,
  city,
  latitude: lat,
  longitude: lon,
});

const freegeoipLocationAdapter = ({
  country_code,
  city,
  latitude,
  longitude,
}) => ({
  country: country_code,
  city,
  latitude,
  longitude,
});

export default {
  [locationSources.airtel]: airtelLocationAdapter,
  [locationSources.freegeoip]: freegeoipLocationAdapter,
};
