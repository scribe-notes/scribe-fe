import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import TranscriptCard from "./TranscriptCard";
import UserContext from "../contexts/UserContext";
import TranscriptContext from "../contexts/TranscriptContext";
import Transcript from "./Transcript";

import share from "../img/share-white.png";

import { Spinner } from "@chakra-ui/core";

import Dropdown from "./Dropdown";

import "./SavedTranscripts.scss";

export default function SavedTranscripts(props) {
  const FILTER_OPTIONS = ["all", "mine", "shared"];

  // Id of a specific transcript/folder
  const { id } = props.match.params;

  const [pageTitle, setPageTitle] = useState("Saved Transcripts");

  const [filterBy, setFilterBy] = useState(FILTER_OPTIONS[0]);

  const { user } = useContext(UserContext);
  const {
    postTranscript,
    getMyTranscripts,
    transcript,
    setTranscript,
    getTranscript
  } = useContext(TranscriptContext);

  useEffect(() => {
    if (transcript.currentTranscript)
      setPageTitle(transcript.currentTranscript.title);
    else if (!id) setPageTitle("Saved Transcripts");
  }, [transcript.currentTranscript, id]);

  const getContents = () => {
    if (id) {
      getTranscript(id).then(err => {
        // Handle an error
      });
    } else getMyTranscripts();
  };

  useEffect(getContents, [id]);

  const onChangeFilterBy = option => {
    setFilterBy(option);
  };

  const createFolder = () => {
    setTranscript({
      ...transcript,
      transcripts: [
        ...transcript.transcripts,
        {
          creator: user.id,
          _id: "newFolder"
        }
      ]
    });
  };

  const cancelFolder = () => {
    const transcripts = transcript.transcripts.filter(t => {
      return t._id !== "newFolder";
    });
    setTranscript({
      ...transcript,
      transcripts
    });
  };

  const submitFolder = title => {
    const transcript = { title, isGroup: true, parent: id };

    postTranscript(transcript);
  };

  return (
    <div className="saved-transcripts">
      <h2>{transcript.isGetting ? <Spinner /> : pageTitle}</h2>
      {id &&
      transcript.currentTranscript &&
      !transcript.currentTranscript.isGroup ? (
        <Transcript />
      ) : (
        <div className="list">
          <div className="toolbar">
            <div className="left">
              <div className="filter">
                <label>FILTER BY</label>
                <Dropdown
                  allcaps
                  onChange={onChangeFilterBy}
                  value={filterBy}
                  options={FILTER_OPTIONS}
                />
              </div>
            </div>
            <div className="right">
              <div onClick={() => props.history.push("/new")} className={`btn ${transcript.isGetting && 'disabled'}`}>
                + NEW TRANSCRIPT
              </div>
              {filterBy !== "shared" && (
                <>
                  <div onClick={createFolder} className={`btn ${transcript.isGetting && 'disabled'}`}>
                    + NEW FOLDER
                  </div>
                  {id && (
                    <div className="btn disabled">
                      <img src={share} alt="" />
                      SHARE FOLDER
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {transcript.isGetting ? (
            <div className="stretch">
              <Spinner />
            </div>
          ) : transcript.transcripts && transcript.transcripts.length > 0 ? (
            transcript.transcripts
              .filter(transcript => {
                switch (filterBy) {
                  case "mine":
                    return transcript.creator === user.data._id;
                  case "shared":
                    return transcript.creator !== user.data._id;
                  default: {
                    return transcript;
                  }
                }
              })
              .map(transcript => {
                if (!transcript) return null;
                let newFolder = false;
                if (!transcript.createdAt) newFolder = true;
                return (
                  <TranscriptCard
                    pageTitle={pageTitle}
                    history={props.history}
                    submitFolder={submitFolder}
                    cancelFolder={cancelFolder}
                    newFolder={newFolder}
                    key={transcript._id}
                    {...transcript}
                  />
                );
              })
          ) : (
            <p className="empty">
              {id
                ? "This folder has no transcripts! "
                : "You have no transcripts! "}
              <Link to="/new">Create one now</Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
