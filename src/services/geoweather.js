import { map } from "rxjs";
import location from "./location";

const getGeoWeather = () => {
  location.getGeoLocation("1.1.1.1").pipe(map((response) => {}));
};

export { getGeoWeather };
