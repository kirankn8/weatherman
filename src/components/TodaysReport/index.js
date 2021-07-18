import React from "react";
import { stringutils } from "../../utils";
import "./index.css";
import "animate.css";

const TodaysReport = () => {
  const weather = {
    time: "16/07/2021, 09:00:00",
    temperature: "25°C",
    weather: "Light Rain Day",
    wind: "W 3.4-8.0m/s (moderate)",
    "precipitation type": "rain",
    predictions: [
      "Very Cloudy",
      "Light rain or showers",
      "Light or occasional snow",
    ],
  };
  const emoji = "rain";

  const renderWeatherinfo = () => {
    return (
      <div className={`${emoji}`} key={emoji}>
        <div className="today-forecast">
          {Object.keys(weather).map((key) => (
            <div className="weather-properties" key={key}>
              <span className="weather-properties-title">
                {stringutils.toTitleCase(key)}:
              </span>
              <span className="weather-properties-info">
                {stringutils.arrayToString(weather[key])}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="todays-report-container">
      <div className="todays-report-heading">
        <div>Today&apos;s Weather</div>
        <div className={`${emoji} todays-report`}>
          {/* <div
            className={`emoji animate__animated animate__infinite animate__slower	 ${weatherEmojis[emoji].animate}`}
          >
            {weatherEmojis[emoji].unicode}
          </div> */}
        </div>
      </div>
      <div className="todays-report-body">{renderWeatherinfo()}</div>
    </div>
  );
};

export { TodaysReport };
