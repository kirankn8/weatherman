import React, { useEffect } from "react";
import { QnA } from "./components/QnA";
import { TodaysReport } from "./components/TodaysReport";
import { DailyForecast } from "./components/DailyForecast";
import { WeeklyForecast } from "./components/WeeklyForecast";
import "./app.css";
import { weather } from "./services";

const vscode = window["vscode"];

const App = () => {
  useEffect(() => {
    weather
      .getWeatherFromGeo(12.95396, 77.4908543)
      .subscribe((res) => console.log(res));
  }, []);
  return (
    <div>
      {/* <Heading /> */}
      <div className="banner">
        <TodaysReport />
        <QnA />
      </div>
      <DailyForecast />
      <WeeklyForecast />
    </div>
  );
};

export { App };
