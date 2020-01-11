import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import TranscriptCard from "./TranscriptCard";
import HistoryContext from "../contexts/HistoryContext";
import UserContext from "../contexts/UserContext";
import TranscriptContext from "../contexts/TranscriptContext";
import Transcript from "./Transcript";

import share from "../img/share-white.png";

import { Spinner } from "@chakra-ui/core";

import Dropdown from "./Dropdown";

import "./SavedTranscripts.scss";

export default function SavedTranscripts(props) {
  const FILTER_OPTIONS = ["all", "mine", "shared"];
  const SORT_OPTIONS = ["name", "createdAt", "duration"];

  const [sortReverse, setSortReverse] = useState(false);

  // Id of a specific transcript/folder
  const { id } = props.match.params;

  const [pageTitle, setPageTitle] = useState("Saved Transcripts");

  const [filterBy, setFilterBy] = useState(FILTER_OPTIONS[0]);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);

  const { user } = useContext(UserContext);
  const {
    postTranscript,
    getMyTranscripts,
    transcript,
    setTranscript,
    getTranscript
  } = useContext(TranscriptContext);

  const { history, setHistory } = useContext(HistoryContext);

  const validateHistory = useCallback(() => {
    // Here, we ensure that we have a history item to take us up a level
    // if we first load into a directory

    // TODO: Check to make sure we have access to the parent directory
    // before doing this

    if (id && history.length === 0 && transcript.currentTranscript._id === id) {
      let title = "Saved Transcripts";
      let path = "/transcripts";
      console.log("creating history...");
      if (transcript.currentTranscript.parent) {
        //TODO: Get the correct title of parent directory
        title = transcript.currentTranscript.parent.title;
        path = `/transcripts/${transcript.currentTranscript.parent}`;
      }
      setHistory([...history, { title, path }]);
    }
  }, [id, history, transcript, setHistory]);

  useEffect(() => {
    if (transcript.currentTranscript) {
      setPageTitle(transcript.currentTranscript.title);
      validateHistory();
    } else if (!id) setPageTitle("Saved Transcripts");
  }, [transcript.currentTranscript, id, validateHistory]);

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

  const handleCreate = () => {
    setHistory([
      ...history,
      {
        title: pageTitle,
        path: window.location.pathname
      }
    ]);
    props.history.push(`/new${id ? `/${id}` : ""}`);
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

  const setSort = newSort => {
    console.log(newSort);
    switch (newSort) {
      case SORT_OPTIONS[0]: {
        // Name
        if (newSort === SORT_OPTIONS[0])
          // Reverse
          setSortReverse(!sortReverse);
        else {
          setSortReverse(false);
          setSortBy(SORT_OPTIONS[0]);
        }
        break;
      }
      case SORT_OPTIONS[1]: {
        if (newSort === SORT_OPTIONS[1]) setSortReverse(!sortReverse);
        else {
          setSortReverse(false);
          setSortBy(SORT_OPTIONS[1]);
        }
        break;
      }
      case SORT_OPTIONS[2]: {
        if (newSort === SORT_OPTIONS[2]) {
          setSortReverse(false);
          setSortBy(SORT_OPTIONS[1]);
        }
        break;
      }
      default: {
        return;
      }
    }
    console.log(transcript.transcripts);
    setTranscript({
      ...transcript,
      transcripts: transcript.transcripts.sort((a, b) => {
        if(!a || !b)  return 0;
        switch (sortBy) {
          case SORT_OPTIONS[0]: {
            if (sortReverse) return b.title - a.title;
            else return a.title - b.title;
          }
          case SORT_OPTIONS[1]: {
            if (sortReverse) return b.createdAt - a.createdAt;
            else return a.createdAt - b.createdAt;
          }
          case SORT_OPTIONS[2]: {
            if (sortReverse) return b.recordingLength - a.recordingLength;
            else return a.recordingLength - b.recordingLength;
          }
          default: {
            return a.title - b.title;
          }
        }
      })
    });
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
              <div
                onClick={handleCreate}
                className={`btn ${transcript.isGetting && "disabled"}`}
              >
                + NEW TRANSCRIPT
              </div>
              {filterBy !== "shared" && (
                <>
                  <div
                    onClick={createFolder}
                    className={`btn ${transcript.isGetting && "disabled"}`}
                  >
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
          <div className="viewer">
            <div className="icon"></div>
            <div className="name" onClick={() => setSort("name")}>
              Name
            </div>
            <div className="date-created" onClick={() => setSort("createdAt")}>
              Date Created
            </div>
            <div className="duration">Duration</div>
            <div className="icon"></div>
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
              .map(t => {
                if (!t) return null;
                let newFolder = false;
                if (!t.createdAt) newFolder = true;
                return (
                  <TranscriptCard
                    disabled={transcript.isPosting || transcript.isGetting || transcript.isUpdating}
                    pageTitle={pageTitle}
                    history={props.history}
                    submitFolder={submitFolder}
                    cancelFolder={cancelFolder}
                    newFolder={newFolder}
                    key={t._id}
                    {...t}
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
