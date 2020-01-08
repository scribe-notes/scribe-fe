import React, { useState, useEffect, useContext } from "react";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";
import { FaStopCircle, FaCircle } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import queryString from "query-string";

import TranscriptContext from "../../contexts/TranscriptContext";
import HistoryContext from "../../contexts/HistoryContext";

import "./NewTranscript.scss";

export default function NewTranscript(props) {
  const [voiceIndex, setVoiceIndex] = useState(null);
  const [next, setNext] = useState(false);
  const [recordingLength, setRecordingLength] = useState(0);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [newValue, setNewValue] = useState("");
  const { speak, voices } = useSpeechSynthesis();
  const voice = voices[voiceIndex] || null;

  const { history, setHistory } = useContext(HistoryContext);
  const { postTranscript, transcript, getTranscript } = useContext(TranscriptContext);

  // Id of a parent, if any
  const { id } = props.match.params;

  const update = () => {
    setValue(value + " " + newValue);
  };

  const init = () => {
    // If we have an id but no data for it, get it
    if(!transcript.currentTranscript && id)
      getTranscript(id);
  }

  useEffect(init, [id]);

  useEffect(update, [newValue]);

  useEffect(() => {
    setError(transcript.error);
  }, [transcript.error]);

  useEffect(() => {
    const values = queryString.parse(props.location.search);

    if (values.step) {
      if (values.step === "1") {
        setNext(false);
      } else {
        setNext(true);
      }
    }
  }, [props.location.search]);

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: result => setNewValue(result)
  });

  const NextHandler = () => {
    if (listening) StopAndTime();
    // Get the current pathname
    let currentPath = window.location.pathname;

    // If there is a residual query string, remove it
    const end = currentPath.indexOf("?step=");
    if (end !== -1) currentPath = currentPath.slice(0, end);

    // Define where to go from here
    const newPath = `${currentPath}?step=2`;

    // Record the current location in history
    setHistory([
      ...history,
      {
        title: "New Transcript",
        path: `${currentPath}?step=1`
      }
    ]);

    // Go to the next step
    props.history.push(newPath);
    return setNext(true);
  };

  const ListenAndTime = () => {
    setRecordingLength(Date.now());

    listen({ interimResults: false });
  };

  const StopAndTime = () => {
    setRecordingLength(Math.round((Date.now() - recordingLength) / 1000));
    stop();
  };

  const handleDiscard = () => {
    props.history.push("/new");
    window.location.reload();
  };

  const HandlePost = e => {
    e.preventDefault();

    if (!title) return setError("Title is required!");

    if (!value) return setError("Transcript cannot be blank!");

    let obj = {
      data: value,
      recordingLength: recordingLength.toString(),
      title
    };

    // If we have an id, assign it as the parent of this transcript
    if(id) {
      obj.parent = id;
    }

    postTranscript(obj).then(err => {
      console.log(err);
      if (!err) {
        setHistory([]);
        props.history.push(`/transcripts${id ? `/${id}` : ''}`);
      } else {
        setError(err);
      }
    });
  };

  if (!next) {
    return (
      <div className="new-transcript">
        <div className="controls">
          <div className="left">
            <h1>
              {id ? (
                <span className='directory'>
                  {transcript.currentTranscript.title}/ 
                </span>
              ) : (
                ""
              )}
              New Transcript
            </h1>
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
              <div
                className="button"
                onClick={() => speak({ text: value, voice, rate: 1, pitch: 1 })}
              >
                <AiFillSound />
              </div>
              <div className="button" onClick={StopAndTime}>
                <FaStopCircle />
              </div>
              <div className="button" onClick={ListenAndTime}>
                <FaCircle />
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
            <div className="buttons">
              <div
                className={`button ${value.trim() === "" && "disabled"}`}
                onClick={NextHandler}
              >
                Next
              </div>
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
              Please Review the following transcript and make corrections as
              needed.
            </p>
            <p>Click Finish when done</p>
            <p>Or Discard to cancel</p>
          </div>
          <div className="right">
            <p className="error">{error}</p>
            <div className="buttons">
              <div
                className={`button ${transcript.isPosting && "disabled"}`}
                onClick={HandlePost}
              >
                FINISH
              </div>
              <div
                className={`button discard ${transcript.isPosting &&
                  "disabled"}`}
                onClick={handleDiscard}
              >
                DISCARD
              </div>
            </div>
          </div>
        </div>
        <input
          disabled={transcript.isPosting}
          className="title"
          placeholder="Title goes here..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          disabled={transcript.isPosting}
          className="text"
          value={value}
          onChange={event => setValue(event.target.value)}
        />
      </div>
    );
  }
}
