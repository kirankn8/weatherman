import React, { useEffect, useState } from "react";
import { QnA } from "./components/QnA";
import { TodaysReport } from "./components/TodaysReport";
import { DailyForecast } from "./components/DailyForecast";
import { WeeklyForecast } from "./components/WeeklyForecast";
import { filter, fromEvent, map } from "rxjs";
import "./app.css";

const vscode = window["vscode"];

const App = () => {
  const [dailyForecast, setDailyForecast] = useState([]);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [geolocation, setGeolocation] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fromEvent(window, "message")
      .pipe(
        filter((event) => Boolean(event["data"])),
        filter((event) => Boolean(event["data"]["geoLocation"])),
        map((event) => event["data"])
      )
      .subscribe(
        ({ dailyForecast: df, weeklyForecast: wf, geoLocation: gl }) => {
          setDailyForecast(df.forecast);
          setWeeklyForecast(wf.forecast);
          setGeolocation(gl.geolocation);
          setDataLoaded(true);
        }
      );
  }, []);
  if (dataLoaded) {
    return (
      <div>
        <div className="banner">
          <TodaysReport
            time={time}
            dailyForecast={dailyForecast}
            geolocation={geolocation}
          />
          <QnA dailyForecast={dailyForecast} />
        </div>
        <DailyForecast dailyForecast={dailyForecast} />
        <WeeklyForecast weeklyForecast={weeklyForecast} />
      </div>
    );
  }
  return null;
};

export { App };
