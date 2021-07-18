import React, { useEffect } from "react";
import { QnA } from "./components/QnA";
import { TodaysReport } from "./components/TodaysReport";
import { DailyForecast } from "./components/DailyForecast";
import { WeeklyForecast } from "./components/WeeklyForecast";
import "./app.css";

const vscode = window["vscode"];

const App = () => {
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
