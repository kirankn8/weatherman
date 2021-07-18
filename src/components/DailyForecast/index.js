import React from "react";
import "./index.css";

const DailyForecast = () => {
  const forecasts = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
  ];

  const renderTimeForecast = (forecast) => {
    return (
      <div className="time-forecast-container">
        <div className="time-forecast-heading">{forecast.time}</div>
        <div className="time-forecast-body">
          <div>[emoji]{forecast.weather}</div>
          <div>[emoji]{forecast.temperature}</div>
          <div>[emoji]{forecast.wind}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="forecast-container">
      <div className="forecast-heading">Weather Forecast</div>
      <div className="forecast-body">
        {forecasts.map((forecast) => renderTimeForecast(forecast))}
      </div>
    </div>
  );
};

export { DailyForecast };
