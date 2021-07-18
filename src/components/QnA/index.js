import React from "react";
import "./index.css";

const QnA = () => {
  return (
    <div className="qna-container">
      <div className="question">Do I need an Umbrella?</div>
      <div className="answer">No.</div>
      <div className="answer">Yes.</div>
      <div className="answer">Maybe.</div>
      <div className="detail-answer">It is predicted to rain at 9pm</div>
    </div>
  );
};

export { QnA };
