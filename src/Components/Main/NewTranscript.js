import React, { useState, useEffect } from "react";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";
import { FaStopCircle, FaCircle } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { Link, Redirect } from "react-router-dom";

import "./NewTranscript.scss";

export default function NewTranscript() {
  const [voiceIndex, setVoiceIndex] = useState(null);
  const [next, setNext] = useState(false);
  const [token, setToken] = useState(false);
  const [value, setValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const { speak, voices } = useSpeechSynthesis();
  const voice = voices[voiceIndex] || null;

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
    return setNext(true);
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
              <div
                className="button"
                onClick={() => listen({ interimResults: false })}
              >
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
            <div className="button" onClick={() => setNext(true)}>
              Next
            </div>
          </div>
        </div>

        <textarea className='text' readOnly value={value} />
      </div>
    );
  } else {
    return (
      <div className="new-transcript">
        <div className="controls"></div>
        <textarea
          value={value}
          onChange={event => setValue(event.target.value)}
        />
      </div>
    );
  }
}
