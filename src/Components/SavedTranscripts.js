import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import TranscriptCard from "./TranscriptCard";
import HistoryContext from "../contexts/HistoryContext";
import Transcript from "./Transcript";

import share from "../img/share-white.png";

import { Spinner } from "@chakra-ui/core";

import Dropdown from "./Dropdown";

import "./SavedTranscripts.scss";

import { connect } from "react-redux";

import {
  getRootTranscripts,
  getTranscript,
  postTranscript,
  draftNewFolder,
  cancelNewFolder
} from "../actions";

const SavedTranscripts = props => {
  const FILTER_OPTIONS = ["all", "mine", "shared"];

  // Id of a specific transcript/folder
  const { id } = props.match.params;

  const [pageTitle, setPageTitle] = useState("Saved Transcripts");

  const [filterBy, setFilterBy] = useState(FILTER_OPTIONS[0]);

  const { history, setHistory } = useContext(HistoryContext);

  const validateHistory = useCallback(() => {
    // Here, we ensure that we have a history item to take us up a level
    // if we first load into a directory

    // TODO: Check to make sure we have access to the parent directory
    // before doing this

    if (id && history.length === 0 && props.transcripts.data?._id === id) {
      let title = "Saved Transcripts";
      let path = "/transcripts";
      console.log("creating history...");
      if (props.transcripts.data.parent) {
        //TODO: Get the correct title of parent directory
        title = props.transcripts.data.parent.title;
        path = `/transcripts/${props.transcripts.data.parent}`;
      }
      setHistory([...history, { title, path }]);
    }
  }, [id, history, props.transcripts, setHistory]);

  useEffect(() => {
    if (props.transcripts.data?.children) {
      setPageTitle(props.transcripts.data?.title);
      validateHistory();
    } else if (!id) setPageTitle("Saved Transcripts");
  }, [props.transcripts.data, id, validateHistory]);

  const getContents = () => {
    if (id) {
      props.getTranscript(id);
    } else props.getRootTranscripts();
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
    props.draftNewFolder({
      creator: props.user.data._id,
      _id: "newFolder"
    });
  };

  const cancelFolder = () => {
    props.cancelNewFolder("newFolder");
  };

  const submitFolder = title => {
    const transcript = { title, isGroup: true, parent: id };

    props.cancelNewFolder("newFolder");
    props.postTranscript(transcript);
  };

  // Should we view a singular transcript?
  const viewSingular =
    id &&
    props.transcripts.data &&
    !props.transcripts.data.length &&
    !props.transcripts.data.isGroup;

  const transcripts = id
    ? !viewSingular && props.transcripts.data?.children
    : props.transcripts.data;

  return (
    <div className="saved-transcripts">
      <h2>{props.transcripts.isLoading ? <Spinner /> : pageTitle}</h2>
      {viewSingular ? (
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
                className={`default-btn ${props.transcripts.isLoading &&
                  "disabled"}`}
              >
                + NEW TRANSCRIPT
              </div>
              {filterBy !== "shared" && (
                <>
                  <div
                    onClick={createFolder}
                    className={`default-btn ${props.transcripts.isLoading &&
                      "disabled"}`}
                  >
                    + NEW FOLDER
                  </div>
                  {id && (
                    <div className="default-btn disabled">
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
            <div className="name">
              Name
            </div>
            <div className="date-created">
              Date Created
            </div>
            <div className="duration">Duration</div>
            <div className="icon"></div>
          </div>
          {props.transcripts.isLoading && !props.transcripts.data ? (
            <div className="stretch">
              <Spinner />
            </div>
          ) : transcripts && transcripts.length > 0 ? (
            transcripts
              .filter(transcript => {
                switch (filterBy) {
                  case "mine":
                    return transcript.creator === props.user.data._id;
                  case "shared":
                    return transcript.creator !== props.user.data._id;
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
                    disabled={props.transcripts.isLoading}
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
};

const mapStateToProps = state => ({
  transcripts: state.transcripts,
  user: state.user
});

export default connect(mapStateToProps, {
  getRootTranscripts,
  getTranscript,
  postTranscript,
  draftNewFolder,
  cancelNewFolder
})(SavedTranscripts);
