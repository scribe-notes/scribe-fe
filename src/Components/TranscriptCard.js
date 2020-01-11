import React, { useEffect, useRef, useState, useContext } from "react";

import HistoryContext from "../contexts/HistoryContext";
import TranscriptContext from "../contexts/TranscriptContext";

import moment from "moment";

import share from "../img/share-black.png";

import options from "../img/options.png";

import folderIcon from "../img/folder.png";
import transcriptIcon from "../img/transcript.png";

import "./TranscriptCard.scss";
import ContextMenu from "./ContextMenu";

export default function TranscriptCard(props) {

  // If this is being rendered to create a folder,
  // this where the ref for the input will live
  const titleSetter = useRef(null);
  const toggleOptionsRef = useRef(null);

  const [dialogPosition, setDialogPosition] = useState({
    top: 0,
    left: 0
  });

  const thisCard = useRef(null);

  const { history, setHistory } = useContext(HistoryContext);

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
  const handleDelete = e => {
    setShowOptions(false);
    deleteTranscript(props);
  };

  const handleClickOutside = event => {
    if (showOptions && !thisCard?.current?.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const toggleShowOptions = e => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const initDialogPosition = () => {
    if (toggleOptionsRef?.current) {
      const rect = toggleOptionsRef.current.getBoundingClientRect();
      console.log(rect);
      setDialogPosition({
        top: rect.top,
        left: rect.left
      });
    }
  };

  useEffect(initDialogPosition, [toggleOptionsRef]);

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
      }
    ]);
    props.history.push(`/transcripts/${props._id}`);
  };

  const CONTEXT_OPTIONS = [
    {
      name: "Edit"
    },
    {
      name: "Share",
      icon: share
    },
    {
      name: "Delete",
      action: handleDelete
    }
  ];

  return (
    <div
      ref={thisCard}
      onClick={open}
      className={`transcript-card ${props.newFolder &&
        "creating"} ${showOptions && "editing"} ${transcript.isUpdating &&
        "updating"} ${props.disabled && "disabled"}`}
    >
      <img
        className="icon"
        src={props.isGroup || props.newFolder ? folderIcon : transcriptIcon}
        alt=""
      />
      <div className="title">
        {props.newFolder ? (
          <form onSubmit={handleSubmit}>
            <input
              disabled={transcript.isPosting}
              autoComplete="off"
              ref={titleSetter}
              onBlur={props.cancelFolder}
              id="newTitle"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
          </form>
        ) : (
          <h3>{props.title}</h3>
        )}
      </div>
      <div className="date-created">
        {!props.newFolder && moment(props.createdAt).fromNow()}
      </div>
      <p className="length">
        {!props.isGroup && !props.newFolder && `${hours}:${minutes}:${seconds}`}
      </p>
      <ContextMenu
        show={showOptions}
        position={dialogPosition}
        options={CONTEXT_OPTIONS}
      />
      {/* <label>Rename {props.isGroup ? "folder" : "transcript"}</label>
          <input
            disabled={transcript.isUpdating}
            id="newTitle"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <div className="buttons">
            <div
              className={`share disabled ${transcript.isUpdating &&
                "disabled"}`}
            >
              <img src={share} alt="" />
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
          </div> */}
      <img
        ref={toggleOptionsRef}
        onClick={toggleShowOptions}
        className={`icon mini ${props.newFolder && "hidden"} ${showOptions && "active"}`}
        src={options}
        alt=""
      />
    </div>
  );
}
