import React, { useState, useEffect, useContext } from "react";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";
import { FaStopCircle, FaCircle } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { Link, Redirect } from "react-router-dom";
import AxiosWithAuth from "./AxiosWithAuth";

import HistoryContext from "../../contexts/HistoryContext";

import "./NewTranscript.scss";

export default function NewTranscript(props) {
  const [voiceIndex, setVoiceIndex] = useState(null);
  const [next, setNext] = useState(false);
  const [token, setToken] = useState(false);
  const [recordingLength, setRecordingLength] = useState(0);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const { speak, voices } = useSpeechSynthesis();
  const voice = voices[voiceIndex] || null;

  const { history, setHistory } = useContext(HistoryContext);

  useEffect(() => {
    setValue(value + " " + newValue);
  }, [newValue]);

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: result => setNewValue(result)
  });

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const NextHandler = () => {
    console.log(history);
    setHistory([
      ...history,
      {
        title: "New Transcript",
        path: "/new"
      }
    ]);
    return setNext(true);
  };

  let start;
  const ListenAndTime = () => {
    start = Date.now();
    console.log(start);

    listen({ interimResults: false });
  };
  let end;
  const StopAndTime = () => {
    end = Date.now();
    setRecordingLength(end - start);
    console.log(recordingLength, "recording");
    stop();
  };
  const HandlePost = e => {
    e.preventDefault();
    let obj = { data: value, recordingLength: "0", title: title };
    AxiosWithAuth()
      .post("https://hackathon-livenotes.herokuapp.com/transcripts", obj)
      .then(res => {
        console.log(res);
        props.history.push('/');
      })
      .catch(err => {
        console.error(err.response);
      });
  };

  if (token === null) {
    return <Redirect to="/login" />;
  } else if (!next) {
    return (
      <div className="new-transcript">
        <div className="controls">
          <div className="left">
            <h1>New Transcript</h1>
            <select
              id="voice"
              name="voice"
              value={voiceIndex || ""}
              onChange={event => {
                setVoiceIndex(event.target.value);
              }}
            >
              <option value="">Default</option>
              {voices.map((option, index) => (
                <option key={option.voiceURI} value={index}>
                  {`${option.lang} - ${option.name}`}
                </option>
              ))}
            </select>
            <div className="buttons">
              <div className="button" onClick={ListenAndTime}>
                <FaCircle />
              </div>
              <div className="button" onClick={stop}>
                <FaStopCircle />
              </div>
              <div
                className="button"
                onClick={() => speak({ text: value, voice, rate: 1, pitch: 1 })}
              >
                <AiFillSound />
              </div>
            </div>
          </div>
          {listening && (
            <div className="center">
              <div className="rec">.</div>
              <h2>RECORDING...</h2>
            </div>
          )}
          <div className="right">
            <div className="button" onClick={NextHandler}>
              Next
            </div>
          </div>
        </div>

        <textarea className="text" readOnly value={value} />
      </div>
    );
  } else {
    return (
      <div className="new-transcript">
        <div className="controls">
          <div className="left">
            <h1>Save Transcript</h1>
            <p>
              Please Review the fillowing transcript and make corrections as
              needed.
            </p>
            <p>Click Finish when done</p>
            <p>Or Discard to exit</p>
          </div>
          <div className="right">
            <div className="buttons">
              <div
                className="button discard"
                onClick={() => document.location.reload()}
              >
                DISCARD
              </div>
              <div className="button" onClick={HandlePost}>
                FINISH
              </div>
            </div>
          </div>
        </div>
        <input className='title' placeholder='Title goes here...' value={title} onChange={e => setTitle(e.target.value)} />
        <textarea
          className='text'
          value={value}
          onChange={event => setValue(event.target.value)}
        />
      </div>
    );
  }
}
