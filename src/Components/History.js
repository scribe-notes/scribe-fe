import React, { useContext } from "react";

import HistoryContext from "../contexts/HistoryContext";

import arrow from "../img/back.png";

import "./History.scss";

const History = props => {
  const history = useContext(HistoryContext);

  const handleClick = () => {
    const lastPath = history.pop();
    props.history.push(lastPath.path);
  };

  return (
    <div className="history">
      {history.length > 0 && (
        <div className='content' onClick={handleClick}>
          <img src={arrow} alt="" className="arrow" />{" "}
          <p>{history[history.length - 1].title}</p>
        </div>
      )}
    </div>
  );
};

export default History;
