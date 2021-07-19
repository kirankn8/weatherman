import React from "react";
import PropTypes from "prop-types";
import { weather } from "../../services";
import { stringutils } from "../../utils";
import "./index.css";

const DailyForecast = ({ dailyForecast }) => {
  const forecasts = weather.getNextNWeatherUpdates(dailyForecast, 4);
  const getEmoji = (word) => weather.generateWeatherEmoji(word).unicode;
  const formatTime = (time) => new Date(time).toLocaleTimeString();

  const renderTimeForecast = (forecast) => {
    return (
      <div className="time-forecast-container" key={`daily-${forecast.time}`}>
        <div className="time-forecast-heading">{formatTime(forecast.time)}</div>
        <div className="time-forecast-body">
          <div>
            <span className="time-forecast-detail-emoji">
              {getEmoji(forecast.weather)}
            </span>
            {stringutils.toTitleCase(forecast.weather)}
          </div>
          <div>
            <span className="time-forecast-detail-emoji">
              {getEmoji("temperature")}
            </span>
            {forecast.temperature}
          </div>
          <div>
            <span className="time-forecast-detail-emoji">Wind:</span>
            {forecast.wind}
          </div>
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

DailyForecast.propTypes = {
  dailyForecast: PropTypes.array.isRequired,
};

export { DailyForecast };
