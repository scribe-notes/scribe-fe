import React, { useEffect, useRef, useState, useContext } from "react";

import HistoryContext from '../contexts/HistoryContext';
import TranscriptContext from "../contexts/TranscriptContext";

import share from '../img/share-white.png';

import { Spinner } from "@chakra-ui/core";

import options from "../img/options.png";

import "./TranscriptCard.scss";

export default function TranscriptCard(props) {
  // If this is being rendered to create a folder,
  // this where the ref for the input will live
  const titleSetter = useRef(null);
  
  const thisCard = useRef(null);

  const {history, setHistory} = useContext(HistoryContext);

  const { transcript, deleteTranscript, updateTranscript } = useContext(
    TranscriptContext
  );

  // If this is being rendered to create a folder
  // or to edit something's title,
  // this is where our field's data would live
  const [newTitle, setNewTitle] = useState(
    props.title ? props.title : "New Folder"
  );

  // Handle submitting a new folder
  const handleSubmit = e => {
    e.preventDefault();
    props.submitFolder(titleSetter.current.value);
  };

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (!showOptions) setNewTitle(props.title);
  }, [showOptions, props.title]);

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

  // If we have changed the title
  const handleSaveDelete = e => {
    e.preventDefault();
    e.stopPropagation();
    if (props.title === newTitle) {
      deleteTranscript(props);
    } else {
      console.log(props.parent);
      updateTranscript({ title: newTitle, _id: props._id, parent: props.parent }).then(err => {
        if (!err) setShowOptions(false);
      });
    }
  };

  function handleClickOutside(event) {
    if (showOptions && thisCard.current && !thisCard.current.contains(event.target)) {
      setShowOptions(false);
    }
  }

  const toggleShowOptions = e => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const open = () => {
    setHistory([
      ...history,
      {
        title: props.pageTitle,
        path: window.location.pathname
      }]);
    props.history.push(`/transcripts/${props._id}`)
  }

  return (
    <div ref={thisCard}
         onClick={showOptions ? null : open}
      className={`transcript-card ${props.newFolder &&
        "creating"} ${showOptions && "editing"} ${transcript.isUpdating &&
        "updating"}`}
    >
      <div className="title">
        {props.newFolder ? (
          <form onSubmit={handleSubmit}>
            <h3 className="create">Create Folder</h3>
            <input
              autoComplete="off"
              ref={titleSetter}
              onBlur={props.cancelFolder}
              id="newTitle"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
          </form>
        ) : (
          <>
            <h3>{showOptions ? `Edit '${props.title}'` : props.title}</h3>
            <div className="options-toggle">
              { showOptions && transcript.isUpdating ? <Spinner /> :
              <img
                onClick={toggleShowOptions}
                className="icon"
                src={options}
                alt=""
              />}
            </div>
          </>
        )}
      </div>
      {showOptions ? (
        <form onSubmit={handleSaveDelete} className="options">
          <label>Rename {props.isGroup ? "folder" : "transcript"}</label>
          <input
            disabled={transcript.isUpdating}
            id="newTitle"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <div className="buttons">
            <div className={`share disabled ${transcript.isUpdating && "disabled"}`}>
              <img src={share} alt='' />
              Share...
            </div>
            <div
              disabled={transcript.isUpdating}
              onClick={handleSaveDelete}
              className={`${
                props.title === newTitle ? "delete" : "share"
              } ${transcript.isUpdating && "disabled"}`}
            >
              {props.title === newTitle ? "Delete" : "Save"}
            </div>
          </div>
        </form>
      ) : (
        <>
          <div className="preview" maxLength={180}>
            {props.newFolder ? (
              transcript.isPosting ? (
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
        </>
      )}
    </div>
  );
}
