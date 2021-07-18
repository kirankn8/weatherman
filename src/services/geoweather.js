import { mergeMap, tap } from "rxjs";
import location from "./location";
import weather from "./weather";
import ipaddress from "./ipaddress";

const getGeoWeather = () => {
  return ipaddress.getIpAddress().pipe(
    tap((ipaddr) => console.log("ipaddr: ", ipaddr)),
    mergeMap((ipaddr) => location.getGeoLocation(ipaddr)),
    tap((location) => console.log("location: ", location)),
    mergeMap(({ latitude, longitude }) =>
      weather.getWeatherFromGeo(latitude, longitude)
    ),
    tap((weather) => console.log("weather: ", weather))
  );
};

export { getGeoWeather };
