import React from "react";

import "./SavedTranscriptsCards.scss";

export default function SavedTranscriptsCards(props) {
  return (
    <div className="transcript-card">
      <h3>{props.title}</h3>
      <p className='preview' maxLength={180}>{props.data}</p>
      <p className="length">{props.recordingLength}s</p>
    </div>
  );
}
