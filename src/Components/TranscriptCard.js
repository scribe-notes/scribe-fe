import React, { useEffect, useRef, useState, useContext } from "react";

import HistoryContext from "../contexts/HistoryContext";

import moment from "moment";

import share from "../img/share-black.png";

import options from "../img/options.png";

import folderIcon from "../img/folder.png";
import transcriptIcon from "../img/transcript.png";

import "./TranscriptCard.scss";
import ContextMenu from "./ContextMenu";

import { connect } from "react-redux";

import { updateTranscript, deleteTranscript } from "../actions";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Scale,
  Input,
  useDisclosure
} from "@chakra-ui/core";

const TranscriptCard = props => {
  // If this is being rendered to create a folder,
  // this where the ref for the input will live
  const titleSetter = useRef(null);
  const toggleOptionsRef = useRef(null);

  // If this is being rendered to create a folder
  // or to edit something's title,
  // this is where our field's data would live
  const [newTitle, setNewTitle] = useState("New Folder");

  const [dialogAction, setDialogAction] = useState("rename");
  const [dialogError, setDialogError] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef(null);

  const [dialogPosition, setDialogPosition] = useState({
    top: 0,
    left: 0
  });

  const thisCard = useRef(null);

  const { history, setHistory } = useContext(HistoryContext);

  // Handle submitting a new folder
  const handleSubmit = e => {
    e.preventDefault();
    props.submitFolder(titleSetter.current.value);
  };

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (!isOpen) setNewTitle(props.title);
  }, [isOpen, props.title]);

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

  const handleRename = () => {
    setDialogAction("rename");
    setShowOptions(false);
    setDialogError("");
    onOpen();
  };

  const renameThis = e => {
    setDialogError("");
    e && e.preventDefault();
    if (newTitle.trim() === "") return setDialogError("Name cannot be blank");
    props.updateTranscript({
      title: newTitle,
      _id: props._id,
      parent: props.parent
    });
    onClose();
  };

  const deleteThis = () => {
    setDialogError("");
    props.deleteTranscript(props._id);
  };

  // If we have changed the title
  const handleDelete = () => {
    setDialogAction("delete");
    setDialogError("");
    setShowOptions(false);
    onOpen();
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

  const updateDialogPosition = () => {
    if (toggleOptionsRef?.current) {
      const rect = toggleOptionsRef.current.getBoundingClientRect();
      setDialogPosition({
        top: rect.top,
        left: rect.left
      });
    }
  };

  useEffect(updateDialogPosition, [
    toggleOptionsRef,
    props.transcripts.isLoading
  ]);

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", updateDialogPosition);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateDialogPosition);
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
      name: "Rename",
      action: handleRename
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
        "creating"} ${showOptions && "active"} ${props.transcripts.isLoading &&
        "updating"} ${props.disabled && "disabled"}`}
    >
      <img
        className="icon"
        style={{ opacity: props.newFolder ? 0.8 : 1 }}
        src={props.isGroup || props.newFolder ? folderIcon : transcriptIcon}
        alt=""
      />
      <div className="title">
        {props.newFolder ? (
          <form onSubmit={handleSubmit}>
            <input
              disabled={props.transcripts.isLoading}
              autoComplete="off"
              ref={titleSetter}
              onBlur={props.cancelFolder}
              className="new-title"
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
      <img
        ref={toggleOptionsRef}
        onClick={toggleShowOptions}
        className={`icon mini ${props.newFolder && "hidden"} ${showOptions &&
          "active"}`}
        src={options}
        alt=""
      />
      {/* Dialogs */}
      <Scale in={isOpen}>
        {styles => (
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay opacity={styles.opacity} />
            <AlertDialogContent
              {...styles}
              style={{
                borderRadius: "7px"
              }}
            >
              <AlertDialogHeader>
                {dialogAction === "rename" ? "Rename " : "Delete "}'
                {props.title}'
              </AlertDialogHeader>
              <AlertDialogBody>
                {dialogAction === "rename" ? (
                  <form onSubmit={renameThis}>
                    <label>Enter a new name below</label>
                    <Input
                      style={{
                        boxSizing: "border-box",
                        fontWeight: "bold",
                        marginTop: "8px"
                      }}
                      placeholder={
                        props.isGroup ? "New Folder" : "New Transcript"
                      }
                      className="new-title"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                    />
                  </form>
                ) : props.isGroup ? (
                  `Are you sure you want to delete this folder? This folder
                  and all of its contents will be deleted. This cannot be undone.`
                ) : (
                  `Are you sure you want to delete this transcript? This cannot be undone.`
                )}
                <p className="error">{dialogError}</p>
              </AlertDialogBody>
              <AlertDialogFooter style={{ alignItems: "center" }}>
                <div
                  className={`default-btn ${props.transcripts.isLoading &&
                    "disabled"}`}
                  ref={cancelRef}
                  onClick={onClose}
                >
                  Cancel
                </div>
                <div
                  className={`default-btn ${props.transcripts.isLoading &&
                    "disabled"} ${dialogAction === "delete" && "red"}`}
                  onClick={dialogAction === "rename" ? renameThis : deleteThis}
                >
                  {dialogAction === "rename" ? "Rename" : "Delete"}
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Scale>
    </div>
  );
};

const mapStateToProps = state => ({
  transcripts: state.transcripts
});

export default connect(mapStateToProps, { updateTranscript, deleteTranscript })(
  TranscriptCard
);
