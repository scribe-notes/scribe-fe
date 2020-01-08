import React, { useContext } from "react";

import TranscriptContext from "../contexts/TranscriptContext";

import share from '../img/share-white.png';

import "./Transcript.scss";

const Transcript = props => {
  const { transcript: currentTranscript } = useContext(TranscriptContext);

  return (
    <div className="transcript">
      <div className="toolbar">
        <div className="left">
          <div className="btn disabled">Edit</div>
          <div className="btn disabled">Narrate</div>
        </div>
        <div className="right">
          {/* If shared, show this */}
          <label className="shared-with">
            Shared with {currentTranscript.sharedWith.length}
          </label>
          {/* Here will be a list of people */}
          <div className="btn disabled">
            <img src={share} alt='' />
            Share...
            </div>
        </div>
      </div>
      <textarea readOnly className="text" value={currentTranscript.data} />
    </div>
  );
};

export default Transcript;
