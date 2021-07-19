import React, { useEffect, useState } from "react";
import { QnA } from "./components/QnA";
import { TodaysReport } from "./components/TodaysReport";
import { DailyForecast } from "./components/DailyForecast";
import { WeeklyForecast } from "./components/WeeklyForecast";
import { filter, fromEvent, map, tap } from "rxjs";
import "./app.css";

const vscode = window["vscode"];

const App = () => {
  const [dailyForecast, setDailyForecast] = useState([]);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [geolocation, setGeolocation] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fromEvent(window, "message")
      .pipe(
        filter((event) => Boolean(event["data"])),
        filter((event) => Boolean(event["data"]["geoLocation"])),
        map((event) => event["data"])
      )
      .subscribe(
        ({ dailyForecast: df, weeklyForecast: wf, geoLocation: gl }) => {
          console.log("Inside Subscribe. ...");
          setDailyForecast(df.forecast);
          setWeeklyForecast(wf.forecast);
          setGeolocation(gl.geolocation);
          setDataLoaded(true);
        }
      );
  }, []);
  if (dataLoaded) {
    console.log(
      "dailyForecast, weeklyForecast, geolocation: ",
      dailyForecast,
      weeklyForecast,
      geolocation
    );
    return (
      <div>
        <div className="banner">
          <TodaysReport
            weatherForecasts={dailyForecast}
            geolocation={geolocation}
          />
          <QnA weatherForecasts={dailyForecast} />
        </div>
        <DailyForecast dailyForecast={dailyForecast} />
        <WeeklyForecast weeklyForecast={weeklyForecast} />
      </div>
    );
  }
  return null;
};

export { App };
