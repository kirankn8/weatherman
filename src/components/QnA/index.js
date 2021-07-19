import React from "react";
import PropTypes from "prop-types";
import "./index.css";
import { weather } from "../../services";

const QnA = ({ weatherForecasts }) => {
  const qa = weather.isUmbrellaRequired(weatherForecasts);
  return (
    <div className="qna-container">
      <div className="question">Do I need an Umbrella?</div>
      <div className="answer">{qa.answer}</div>
      <div className="detail-answer">{qa.details}</div>
    </div>
  );
};

QnA.propTypes = {
  weatherForecasts: PropTypes.array.isRequired,
};

export { QnA };
