import { map, tap } from "rxjs";
import location from "./location";

const getGeoWeather = () => {
  location.getGeoLocation("1.1.1.1").pipe(
    tap((location) => console.log(location)),
    map(({ latitude, longitude }) => {})
  );
};

export { getGeoWeather };
