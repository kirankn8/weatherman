import React from "react";
import PropTypes from "prop-types";
import { weather } from "../../services";
import { stringutils } from "../../utils";
import "./index.css";

const WeeklyForecast = ({ weeklyForecast }) => {
  const weeklyForecastUpdated = weeklyForecast.slice(1);
  const getEmoji = (word) => weather.generateWeatherEmoji(word).unicode;
  const formatTime = (time) => new Date(time).toDateString();

  const renderTimeForecast = (forecast) => {
    return (
      <div
        className="time-forecast-container"
        key={`weekly-${forecast.timestamp}`}
      >
        <div className="time-forecast-heading">
          {formatTime(forecast.timestamp)}
        </div>
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
      <div className="forecast-heading">Weekly Forecast</div>
      <div className="forecast-body">
        {weeklyForecastUpdated.map((forecast) => renderTimeForecast(forecast))}
      </div>
    </div>
  );
};

WeeklyForecast.propTypes = {
  weeklyForecast: PropTypes.array.isRequired,
};

WeeklyForecast.defaultProps = {};

export { WeeklyForecast };
