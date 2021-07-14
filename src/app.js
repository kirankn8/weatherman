import React from "react";
import { Heading } from "./components/Heading";
import { QnA } from "./components/QnA";
import { Report } from "./components/Report";
import { Forecast } from "./components/Forecast";
import "./app.css";

const App = () => {
  return (
    <div>
      <Heading />
      <div className="banner">
        <QnA />
        <Report />
      </div>
      <Forecast />
    </div>
  );
};

export { App };
