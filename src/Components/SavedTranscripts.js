import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom';
import AxiosWithAuth from '../Components/Main/AxiosWithAuth'
import SavedTranscriptsCards from './SavedTranscriptsCards'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/core";

import './SavedTranscripts.scss';

export default function SavedTranscripts() {
    const [data,setData] = useState()
    /*
    Write a data filter that renders cards in certain tabs based on their 
    properties.
    */
    let mine = []
    let shared = []
    let empty_transcripts= []
    useEffect(() => {
    
        AxiosWithAuth().get('https://hackathon-livenotes.herokuapp.com/transcripts/mine')
        .then(res => {
            setData(res.data);
            console.log(res.data)
        }).catch(err => {
            console.error(err.response)
        })
    }, [])
    const Filter = () => {

        for(let i = 0;i<data.length;i++){
            if(data[i]===null){
                empty_transcripts.push(data[i])
            }else if(data[i].isGroup === false){
                console.log("inside else if")
                mine.push(data[i])
                console.log(mine,"mine")
            }else if(data[i].isGroup === true){
                shared.push(data[i])
            }
            

        }
    }
    if(data !== undefined){
        Filter();
    }

    return (
        <div className='saved-transcripts'>
          <Tabs variant="enclosed" isFitted variantColor="teal">
              <TabList>
            <Tab>My Transcripts</Tab>
            <Tab>Shared With Me</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    
                <div className='list'>
            {mine && mine.length > 0 ? mine.map(transcript => {
                if(!transcript) return null;
                return <SavedTranscriptsCards key={transcript._id} {...transcript} data_group={transcript.group ="personal" }/>
            }) : <p className='empty'>You have no transcripts! <Link to='/new'>Create one now</Link></p>}
            </div>
                </TabPanel>
                <TabPanel>
                <div className='list'>
            {shared && shared.length > 0 ? shared.map(transcript => {
                if(!transcript) return null;
                return <SavedTranscriptsCards key={transcript._id} {...transcript}  data_group={transcript.group}/>
            }) : <p className='empty'>You have no transcripts! <Link to='/new'>Create one now</Link></p>}
            </div>
                </TabPanel>
            </TabPanels>
           </Tabs>   

        </div>
    )
}
