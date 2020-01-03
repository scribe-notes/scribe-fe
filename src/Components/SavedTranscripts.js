import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom';
import AxiosWithAuth from '../Components/Main/AxiosWithAuth'
import SavedTranscriptsCards from './SavedTranscriptsCards'
export default function SavedTranscripts() {
    const [data,setData] = useState()
    useEffect(() => {
        AxiosWithAuth().get('https://hackathon-livenotes.herokuapp.com/transcripts/mine')
        .then(res => {
            setData(res.data);
        }).catch(err => {
            console.error(err.response)
        })
    }, [])
    
    return (
        <div>
            {data && data.length > 0 ? data.map(transcript => {
                console.log(transcript);
                return <SavedTranscriptsCards key={transcript.id} {...transcript} />
            }) : <p className='empty'>You have no transcripts! <Link to='/new'>Create one now</Link></p>}
        </div>
    )
}
