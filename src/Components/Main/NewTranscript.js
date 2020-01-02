import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { Link, Redirect } from "react-router-dom";

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  background: rgb(214, 211, 211);
  width: 100vw;
  height: 93vh;
`;
const TopDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
const TopLeft = styled.div``;
const Saved = styled(Link)`
  color: #0d73d9;
  text-decoration: none;
  margin: 2%;

  :visited {
    color: #3082ce;
    text-decoration: none;
  }
`;
const RecordingDiv = styled.div`
  display: flex;
  flex-direction: column-reverse;
  color: red;
`;
const Button = styled.button`
  width: 7vw;
  height: 7vh;
  margin: 5px;
  background: #3082ce;
  color: white;
`;
const Buttonz = styled(Link)`
  width: 7vw;
  height: 7vh;
  margin: 5px;
  background: #3082ce;
  color: white;
`;
const Right = styled.div``;
const TextareaContainer = styled.div`
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const Textarea = styled.textarea`
  width: 90vw;
  height: 40vh;
  border-radius: 2.5%;
  border: 2px solid dodgerblue;
  &:focus {
    color: black;
  }
`;
export default function NewTranscript() {
  const [voiceIndex, setVoiceIndex] = useState(null);
  const [next, setNext] = useState(false);
  const [token, setToken] = useState(false);
  const [value, setValue] = useState("");
  const { speak, voices } = useSpeechSynthesis();
  const voice = voices[voiceIndex] || null;
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: result => {
      setValue(result);
    }
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
      <MainDiv>
        <TopDiv>
          <TopLeft>
            <Saved>◄ Saved Transcripts</Saved>
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
            <Button onClick={listen}>
              <FaPlayCircle />
            </Button>
            <Button onClick={stop}>
              <FaPauseCircle />
            </Button>
            <Button onClick={() => speak({ text: value, voice, rate: 1, pitch: 1 })}>
              <AiFillSound />
            </Button>
          </TopLeft>
          <RecordingDiv>
            {listening && <div>Speak into the mic</div>}
          </RecordingDiv>
          <Right>
            <p>Voice commands:</p>
            <p>"Assistant start recording</p>
            <p>"Assistant stop recording</p>
            <Button onClick={() => setNext(true)}>Next</Button>
          </Right>
        </TopDiv>

        <TextareaContainer>
          <Textarea
            disabled
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        </TextareaContainer>
      </MainDiv>
    );
  } else {
    return (
      <MainDiv>
        <TopDiv></TopDiv>
        <TextareaContainer>
          <Textarea
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        </TextareaContainer>
      </MainDiv>
    );
  }
}
