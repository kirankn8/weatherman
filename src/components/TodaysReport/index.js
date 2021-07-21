import React from "react";
import PropTypes from "prop-types";
import { stringutils } from "../../utils";
import { weather } from "../../services";
import "animate.css";
import "./index.css";

const TodaysReport = ({ dailyForecast, geolocation, time }) => {
  const forecast = weather.getCurrentWeatherUpdate(dailyForecast);
  const emoji = forecast
    ? weather.generateWeatherEmoji(forecast.weather)
    : weather.generateWeatherEmoji("default");

  const renderWeatherinfo = () => {
    return (
      <div className={`${emoji.name}`}>
        <div className="today-forecast">
          {geolocation.country && (
            <div className="weather-properties">
              <span className="location-properties-info">
                {`${geolocation.city}, ${geolocation.country}`}
              </span>
              <span className="location-properties-title">
                {weather.generateWeatherEmoji("location").unicode}
              </span>
            </div>
          )}

          <div className="weather-properties">
            <span className="weather-properties-title">Time:</span>
            <span className="weather-properties-info">
              {new Date(time).toLocaleString()}
            </span>
          </div>

          <div className="weather-properties">
            <span className="weather-properties-title">Temperature:</span>
            <span className="weather-properties-info">
              {stringutils.arrayToString(forecast.temperature)}
            </span>
          </div>

          <div className="weather-properties">
            <span className="weather-properties-title">Weather:</span>
            <span className="weather-properties-info">
              {stringutils.arrayToString(forecast.weather)}
            </span>
          </div>

          <div className="weather-properties">
            <span className="weather-properties-title">Wind:</span>
            <span className="weather-properties-info">
              {stringutils.arrayToString(forecast.wind)}
            </span>
          </div>

          <div className="weather-properties">
            <span className="weather-properties-title">
              Precipitation Type:
            </span>
            <span className="weather-properties-info">
              {stringutils.arrayToString(forecast.precipitationType)}
            </span>
          </div>

          <div className="weather-properties">
            <span className="weather-properties-title">Predictions:</span>
            <span className="weather-properties-info">
              {stringutils.arrayToString(forecast.predictions)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="todays-report-container">
      <div className="todays-report-heading">
        <div>Today&apos;s Weather</div>
        <div className={`${emoji.name} todays-report`}>
          <div
            className={`emoji animate__animated animate__infinite animate__slower	${emoji.animate}`}
          >
            {emoji.unicode}
          </div>
        </div>
      </div>
      <div className="todays-report-body">{renderWeatherinfo()}</div>
    </div>
  );
};

TodaysReport.propTypes = {
  dailyForecast: PropTypes.array.isRequired,
  geolocation: PropTypes.object.isRequired,
  time: PropTypes.number.isRequired,
};

export { TodaysReport };
