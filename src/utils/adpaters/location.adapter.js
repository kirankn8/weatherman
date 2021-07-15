const airtelLocationAdapter = ({ country, city, lat, lon }) => ({
  country,
  city,
  latitude: lat,
  longitude: lon,
});

export default {
  airtel: airtelLocationAdapter,
};
