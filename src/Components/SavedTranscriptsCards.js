import React, { useEffect, useRef, useState, useContext } from "react";

import TranscriptContext from "../contexts/TranscriptContext";

import { Spinner } from "@chakra-ui/core";

import options from '../img/options.png';

import "./SavedTranscriptsCards.scss";

export default function SavedTranscriptsCards(props) {
  // If this is being rendered to create a folder,
  // this where the ref for the input will live
  const titleSetter = useRef(null);

  const { transcript } = useContext(TranscriptContext);

  // If this is being rendered to create a folder,
  // this is where our field's data would live
  const [newTitle, setNewTitle] = useState("New Folder");

  // Handle submitting a new folder
  const handleSubmit = e => {
    e.preventDefault();
    props.submitFolder(titleSetter.current.value);
  };

  const [showOptions, setShowOptions] = useState(false);

  // If we are creating a folder, focus the input
  // field right away
  useEffect(() => {
    if (props.newFolder && titleSetter) {
      titleSetter.current.focus();
      titleSetter.current.select();
    }
  }, [props.newFolder, titleSetter]);

  let duration = props.recordingLength;

  let hours = Math.floor(duration / 60 / 60);

  if (hours < 10) {
    hours = `0${hours}`;
  }

  while (duration > 3600) duration -= 3600;

  let minutes = Math.floor(duration / 60);

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  while (duration > 60) duration -= 60;

  let seconds = duration;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return (
    <div className={`transcript-card ${props.newFolder && 'creating'}`}>
      <div className="title">
        {props.newFolder ? (
          <form onSubmit={handleSubmit}>
            <h3 className='create'>Create Folder</h3>
            <input
              ref={titleSetter}
              onBlur={props.cancelFolder}
              id="newTitle"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
          </form>
        ) : (
          <>
            <h3>{props.title}</h3>
            <div className="options">
              <img className='icon' src={options} alt='' />
            </div>
          </>
        )}
      </div>
      <div className="preview" maxLength={180}>
        {props.newFolder ? (
          transcript.isLoading ? (
            <Spinner />
          ) : (
            ""
          )
        ) : (
          <p>{props.data}</p>
        )}
      </div>
      <p className="length">
        {!props.isGroup && !props.newFolder
          ? `${hours}:${minutes}:${seconds}`
          : `Folder`}
      </p>
    </div>
  );
}
