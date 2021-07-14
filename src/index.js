import ReactDOM from "react-dom";
import React from "react";
import { App } from "./app";

const WeatherManApp = () => <App />;
ReactDOM.render(<WeatherManApp />, document.getElementById("root"));

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept("./app", function () {
    ReactDOM.render(<WeatherManApp />, document.getElementById("root"));
  });
}
