import React, { useContext, useEffect, useCallback } from "react";

import HistoryContext from "../contexts/HistoryContext";

import { connect } from 'react-redux';

import arrow from "../img/back.png";

import "./History.scss";
import { matchPath } from 'react-router-dom';

const History = props => {
  const {history, setHistory} = useContext(HistoryContext);

  const popHistory = () => {
    const newHist = history.slice(0, history.length - 1);
    const last = history[history.length - 1];
    setHistory(newHist);
    return last;
  };

  const handleClick = () => {
    const lastPath = popHistory();
    props.history.push(lastPath.path);
  };

  const match = matchPath(props.history.location.pathname, {
    path: '/transcripts/:id'
  })

  let id = match?.params?.id;

  const validateHistory = useCallback(() => {
    // Here, we ensure that we have a history item to take us up a level
    // if we first load into a directory

    // TODO: Check to make sure we have access to the parent directory
    // before doing this

    if (id && history.length === 0 && props.transcripts.data?._id === id) {
      let title = "Saved Transcripts";
      let path = "/transcripts";
      if (props.transcripts.data.parent) {
        title = props.transcripts.data.parent.title;
        path = `/transcripts/${props.transcripts.data.parent._id}`;
      }
      setHistory([...history, { title, path }]);
    }
  }, [id, history, props.transcripts, setHistory]);

  useEffect(() => {
    if (id || props.transcripts.data?.children){
      validateHistory();
    }
  }, [props.transcripts.data, id, validateHistory]);

  return (
    <div className={`history ${history.length && 'active'}`}>
      {history.length > 0 && (
        <div className="content" onClick={handleClick}>
          <img src={arrow} alt="" className="arrow" />{" "}
          <p>{history[history.length - 1].title}</p>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  transcripts: state.transcripts
})

export default connect(mapStateToProps, null)(History);
