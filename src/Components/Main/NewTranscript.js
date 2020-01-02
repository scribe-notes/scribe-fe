import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import { useSpeechRecognition,useSpeechSynthesis  } from "react-speech-kit";
import {FaPlayCircle,FaPauseCircle} from 'react-icons/fa';
import {AiFillSound} from 'react-icons/ai'
import {Link} from 'react-router-dom';




const MainDiv = styled.div`
display:flex;
flex-direction:column;


`
const TopDiv = styled.div`
display:flex;
justify-content:space-evenly;


`
const TopLeft = styled.div`


`
const Saved = styled(Link)`
color:skyblue;
text-decoration:none;
margin:2%;

:visited{
    color:skyblue;
    text-decoration:none;
}

`
const RecordingDiv = styled.div`
display:flex;
flex-direction:column-reverse;
color:red;
`
const Button = styled.button`
width: 5vw;
height:5vh;

`
const Right = styled.div`


`
const TextareaContainer = styled.div`
width:100vw;
display:flex;
justify-content:center;
align-items:center;
`
const Textarea = styled.textarea`
width: 90vw;
height: 40vh;
&:focus{
    color:black;
}
`
export default function NewTranscript() {
    
/*
This component will have three primary states.
False === Init
True === Recording
Editing === Editing a recording so after a recording starts









*/
    const [recording,setRecording] = useState("")
    const [value, setValue] = useState("");
    const { speak } = useSpeechSynthesis();
    const { listen, listening, stop } = useSpeechRecognition({
      onResult: result => {
        setValue(result);
    }
});


        return (
            <MainDiv>
                <TopDiv>
                <TopLeft>
                <Saved>◄Saved Transcripts</Saved>
                <h1>New Transcript</h1>
                <Button onClick={listen} ><FaPlayCircle/></Button>
                <Button onClick ={stop}><FaPauseCircle/></Button>
                <Button onClick={() => speak({ text: value })}><AiFillSound/></Button>
                </TopLeft>
                <RecordingDiv>
                    {listening && <div>Speak into the mic</div>}
                </RecordingDiv>
                <Right>
                    <p>Voice commands:</p>
                    <p>"Assistant start recording</p>
                    <p>"Assistant stop recording</p>
                    <Button>Post Note</Button>
                </Right>
                </TopDiv>

                <TextareaContainer>
                    <Textarea
                        value={value}
                        onChange={event => setValue(event.target.value)}
                    />
                </TextareaContainer>


            </MainDiv>
        )   


}
