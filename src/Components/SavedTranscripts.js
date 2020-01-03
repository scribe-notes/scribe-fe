import React, { useEffect,useState } from 'react'
import AxiosWithAuth from '../Components/Main/AxiosWithAuth'
import SavedTranscriptsCards from './SavedTranscriptsCards'
export default function SavedTranscripts() {
    const [data,setData] = useState()
    useEffect(() => {
        AxiosWithAuth().get('https://hackathon-livenotes.herokuapp.com/transcripts')
        .then(res => {
            setData(res.data)
        }).catch(err => {
            console.error(err)
        })
    }, [])
    
    return (
        <div>
            {data.transcripts.map(x => {
                return <SavedTranscriptsCards x={x}/>
            })}
        </div>
    )
}
