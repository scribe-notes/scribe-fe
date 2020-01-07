import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AxiosWithAuth from "../util/AxiosWithAuth";
import SavedTranscriptsCards from "./SavedTranscriptsCards";
import UserContext from "../contexts/UserContext";
import TranscriptContext from "../contexts/TranscriptContext";

import Dropdown from "./Dropdown";

import "./SavedTranscripts.scss";

export default function SavedTranscripts(props) {
  const [data, setData] = useState();

  const FILTER_OPTIONS = ["all", "mine", "shared"];

  const [filterBy, setFilterBy] = useState(FILTER_OPTIONS[0]);

  const { user } = useContext(UserContext);
  const { postTranscript } = useContext(TranscriptContext);

  const onChangeFilterBy = option => {
    setFilterBy(option);
  };

  useEffect(() => {
    AxiosWithAuth()
      .get(`${process.env.REACT_APP_BACKEND}/transcripts/mine`)
      .then(res => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error(err.response);
      });
  }, []);

  const createFolder = () => {
      setData([
          ...data,
          {
              creator: user.id,
              title: '',
              _id: 'newFolder'
          }
      ])
  }

  const cancelFolder = () => {
      const newData = data.filter(t => {
          return t._id !== 'newFolder';
      })
      setData(newData);
  }

  const submitFolder = title => {
    const transcript = { title, isGroup: true };

    postTranscript(transcript).then(res => {
        console.log(res);
        setData(res.data);
    });
  }

  return (
    <div className="saved-transcripts">
      <h2>Saved Transcripts</h2>
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
            <div onClick={() => props.history.push("/new")} className="btn">
              + NEW TRANSCRIPT
            </div>
            {filterBy !== 'shared' &&
            <div onClick={createFolder} className="btn">+ NEW FOLDER</div>}
          </div>
        </div>
        {data && data.length > 0 ? (
          data
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
              if(!transcript.createdAt) newFolder = true;
              return (
                <SavedTranscriptsCards submitFolder={submitFolder} cancelFolder={cancelFolder} newFolder={newFolder} key={transcript._id} {...transcript} />
              );
            })
        ) : (
          <p className="empty">
            You have no transcripts! <Link to="/new">Create one now</Link>
          </p>
        )}
      </div>
    </div>
  );
}
