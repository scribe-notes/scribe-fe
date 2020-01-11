import React, { useState, useEffect, useContext } from "react";
import { useSpeechRecognition } from "react-speech-kit";
import { FaCircle, FaPauseCircle } from "react-icons/fa";
import queryString from "query-string";

import TranscriptContext from "../../contexts/TranscriptContext";
import HistoryContext from "../../contexts/HistoryContext";

import "./NewTranscript.scss";

export default function NewTranscript(props) {
  const [next, setNext] = useState(false);
  const [recordingLength, setRecordingLength] = useState(0);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [newValue, setNewValue] = useState("");

  // This value is used to animate the recording icon
  const [dimDot, setDimDot] = useState(false);

  const { history, setHistory } = useContext(HistoryContext);
  const { postTranscript, transcript, getTranscript } = useContext(
    TranscriptContext
  );

  // Id of a parent, if any
  const { id } = props.match.params;

  const update = () => {
    setValue(value + " " + newValue);
  };

  const init = () => {
    // If we have an id but no data for it, get it
    if (!transcript.currentTranscript && id) getTranscript(id);
  };

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
    } else setNext(false);
  }, [props.location.search]);

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: result => setNewValue(result)
  });

  const animateRecording = () => {
    setDimDot(true);
    if (!listening) return;
    setTimeout(() => {
      setDimDot(false);
      setTimeout(() => {
        animateRecording();
      }, 1000);
    }, 1000);
  };

  useEffect(animateRecording, [listening]);

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
    if(id)  props.history.push(`/new/${id}`);
    else props.history.push('/new');

    setHistory(history.slice(0, history.length - 1));

    setValue('');
    setTitle('');
    setRecordingLength(0);
    setNewValue('');
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
    if (id) {
      obj.parent = id;
    }

    postTranscript(obj).then(err => {
      console.log(err);
      if (!err) {
        setHistory([]);
        props.history.push(`/transcripts${id ? `/${id}` : ""}`);
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
                <span className="directory">
                  {transcript.currentTranscript.title}/
                </span>
              ) : (
                ""
              )}
              New Transcript
            </h1>
            <p className="instructions">
              Click the record button below to begin recording, and click next
              when you are done.
              <br />
              You will be able to correct any mistakes in the next step.
              <br />
              <strong>
                Note: Your browser may request access to your microphone, which
                is required for this to work!
              </strong>
            </p>
            <div className="buttons">
              <div className={`button ${listening && 'disabled'}`} onClick={ListenAndTime}>
                <FaCircle />
              </div>
              <div className={`button ${!listening && 'disabled'}`} onClick={StopAndTime}>
                <FaPauseCircle />
              </div>
            </div>
          </div>
          <div className="right">
            {listening && (
              <div className='recording'>
                <div className={`rec ${dimDot && "dim"}`}>.</div>
                <h2>RECORDING...</h2>
              </div>
            )}
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

        <textarea className="text read-only" readOnly value={value} />
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
                className={`button discard ${transcript.isPosting &&
                  "disabled"}`}
                onClick={handleDiscard}
              >
                DISCARD
              </div>
              <div
                className={`button ${(transcript.isPosting || !title) && "disabled"}`}
                onClick={HandlePost}
              >
                FINISH
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
