import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import { useSpeechRecognition,useSpeechSynthesis  } from "react-speech-kit";
import {FaPlayCircle,FaPauseCircle} from 'react-icons/fa';
import {AiFillSound} from 'react-icons/ai'
import {Link,Redirect} from 'react-router-dom';




const MainDiv = styled.div`
display:flex;
flex-direction:column;
background:rgb(214,211,211);
width:100vw;
height:93vh;

`
const TopDiv = styled.div`
display:flex;
justify-content:space-evenly;


`
const TopLeft = styled.div`


`
const Saved = styled(Link)`
color:#0D73D9;
text-decoration:none;
margin:2%;

:visited{
    color:#3082CE;
    text-decoration:none;
}

`
const RecordingDiv = styled.div`
display:flex;
flex-direction:column-reverse;
color:red;
`
const Button = styled.button`
width: 7vw;
height:7vh;
margin:5px;
background:#3082CE;
color:white;

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
border-radius:2.5%;
border:2px solid dodgerblue;
&:focus{
    color:black;
}
`
export default function NewTranscript() {
let voice_obj = [{
    default: true,
    lang: "en-AU",
    localService: true,
    name: "Karen",
    voiceURI: "Karen"
  }];
/*
This component will have three primary states.
False === Init
True === Recording
Editing === Editing a recording so after a recording starts






l


*/
     const [token, setToken] = useState(false)
    const [value, setValue] = useState("");
    const { speak } = useSpeechSynthesis();
    const { listen, listening, stop } = useSpeechRecognition({
        
      onResult: result => {

        setValue(result);
    }
});
useEffect(() => {
setToken(localStorage.getItem("token"))
},[])
if(token===null){
    return <Redirect to="/login"/>
  }

        return (
            <MainDiv>
                <TopDiv>
                <TopLeft>
                <Saved>◄ Saved Transcripts</Saved>
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
                    <Button type ="submit">Post Note</Button>
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
