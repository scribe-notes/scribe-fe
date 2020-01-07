import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosWithAuth from "../util/AxiosWithAuth";
import SavedTranscriptsCards from "./SavedTranscriptsCards";

import "./SavedTranscripts.scss";

export default function SavedTranscripts() {
  const [data, setData] = useState();
  useEffect(() => {
    AxiosWithAuth()
      .get("https://hackathon-livenotes.herokuapp.com/transcripts/mine")
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error(err.response);
      });
  }, []);

  return (
    <div className="saved-transcripts">
      <h2>Saved Transcripts</h2>
      <div className="list">
        {data && data.length > 0 ? (
          data.map(transcript => {
            if (!transcript) return null;
            return (
              <SavedTranscriptsCards key={transcript._id} {...transcript} />
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
