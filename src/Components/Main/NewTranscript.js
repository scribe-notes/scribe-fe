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
:hover{
    background:white;
    color:#3082CE;
}

`
const Buttonz = styled(Link)`
width: 7vw;
height:7vh;
margin:5px;
background:#3082CE;
color:white;

`
const TopNextDiv = styled.div`
display:flex;
margin:5%;

`
const NextLeft = styled.div`

`
const NextRight = styled.div`
display:flex;
flex-direction:column-reverse;

`
const ButtonContainer = styled.div`
display:flex;

`

const ButtonLong = styled.button`
width:20vw;
height:30px;
background:red;
color:white;

:visited{
    color:white;
}
:hover{
    background:white;
    color:red;
}

`
const ButtonLong2 = styled.button`
width:20vw;
height:30px;
background:#3082CE;
color:white;
:hover{
    background:white;
    color:#3082CE;
}

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

export default function NewTranscript(props) {
    let backtrack = false;
    const [pitch, setPitch] = useState(1);
    const [rate, setRate] = useState(1);
    let speech_string =""
    const [voiceIndex, setVoiceIndex] = useState(null);
    const [next,setNext] = useState('false')
     const [token, setToken] = useState(false)
    const [value, setValue] = useState("");
    const { speak,voices } = useSpeechSynthesis();
    const voice = voices[voiceIndex] || null;
    const { listen, listening, stop } = useSpeechRecognition({
        
      onResult: result => {
        console.log(result)
        setValue(result)
        // setValue(result);
        // speech_string += result
        // console.log(speech_string)
    }
});
useEffect(() => {
setToken(localStorage.getItem("token"))
},[])

if(backtrack === true){
    return <Redirect to="/"/>
}
if(token===null){
    return <Redirect to="/login"/>
  }


        if(next === 'false'){
            return (
                <MainDiv>
                    <TopDiv>
                    <TopLeft>
                    <Saved>◄ Saved Transcripts</Saved>
                    <h1>New Transcript</h1>
                    <select
                  id="voice"
                  name="voice"
                  value={voiceIndex || ''}
                  onChange={(event) => { setVoiceIndex(event.target.value); }}
                >
                  <option value="">Default</option>
                  {voices.map((option, index) => (
                    <option key={option.voiceURI} value={index}>
                      {`${option.lang} - ${option.name}`}
                    </option>
                  ))}
                </select>
                    <Button onClick={listen} ><FaPlayCircle/></Button>
                    <Button onClick ={stop}><FaPauseCircle/></Button>
                    <Button onClick={() => speak({ text: value,voice, rate, pitch})}><AiFillSound/></Button>
                    </TopLeft>
                    <RecordingDiv>
                        {listening && <div>Speak into the mic</div>}
                    </RecordingDiv>
                    <Right>
                        <p>Voice commands:</p>
                        <p>"Assistant start recording</p>
                        <p>"Assistant stop recording</p>
                        <Button onClick = {() =>setNext(true)}>Next</Button>
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
            )   
        }else{
            return(
                <MainDiv>
                    <TopNextDiv>
                    <NextLeft>
                    <Saved>New Transcript</Saved>
                    <h1>Save Transcript</h1>
                    <p>Please Review the fillowing transcript and make corrections as needed.</p>
                    <p>Click Finish when done</p>
                    <p>Or Discard to exit</p>

                    
                    </NextLeft>
                    <NextRight>
                        <ButtonContainer>
                        <ButtonLong  onClick={() =>document.location.reload()}>DISCARD</ButtonLong>
                        <ButtonLong2>FINISH</ButtonLong2>
                        <button onClick={() => speak({ text: value,voice, rate, pitch})}><AiFillSound/></button>
                        </ButtonContainer>

                    </NextRight>
                    </TopNextDiv>
                    <TextareaContainer>
                        <Textarea
                            value={value}
                            onChange={event => setValue(event.target.value)}
                        />
                    </TextareaContainer>
                </MainDiv>
            )
        }



}
