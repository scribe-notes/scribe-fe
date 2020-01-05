import React from "react";
import {FaShareSquare,FaRegComments} from 'react-icons/fa'
import {Link} from 'react-router-dom';

import "./SavedTranscriptsCards.scss";

export default function SavedTranscriptsCards(props) {

  let duration = props.recordingLength;

  let hours = Math.floor((duration / 60) / 60);

  if(hours < 10) {
    hours = `0${hours}`;
}

  while(duration > 3600) duration -= 3600;

  let minutes = Math.floor(duration / 60);

  if(minutes < 10) {
      minutes = `0${minutes}`;
  }

  while(duration > 60) duration -= 60;

  let seconds = duration;

  if(seconds < 10) {
    seconds = `0${seconds}`;
}

  return (
    <div className="transcript-card">
      <span><h3>{props.title}</h3><h6>{props.data_group}</h6></span>
      <p className='preview' maxLength={180}>{props.data}</p>
        <p className="length">{hours}:{minutes}:{seconds}</p>
        <div className="icons">
        <Link to="/share"><FaShareSquare className="icon" /></Link>

        <FaRegComments className="icon"/>
        </div>
        
        


    </div>
  );
}
