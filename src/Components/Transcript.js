import React from "react";

import share from '../img/share-white.png';

import "./Transcript.scss";

import { connect } from 'react-redux';

const Transcript = props => {
  return (
    <div className="transcript">
      <div className="toolbar">
        <div className="left">
          <div className="default-btn disabled">Edit</div>
          <div className="default-btn disabled">Narrate</div>
        </div>
        <div className="right">
          {/* If shared, show this */}
          <label className="shared-with">
            Shared with {props.transcripts.data?.sharedWith?.length}
          </label>
          {/* Here will be a list of people */}
          <div className="default-btn disabled">
            <img src={share} alt='' />
            Share...
            </div>
        </div>
      </div>
      <textarea readOnly className="text" value={props.transcripts.data?.data} />
    </div>
  );
};

const mapStateToProps = state => ({
  transcripts: state.transcripts
})

export default connect(mapStateToProps, null)(Transcript);
