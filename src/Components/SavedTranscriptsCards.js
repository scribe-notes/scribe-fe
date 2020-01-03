import React from 'react'

export default function SavedTranscriptsCards(props) {
    return (
        <div>
<p>Title{props.title}</p>
    <p>Transcript:{props.data}</p>
<p>Recording Length:{props.recordingLength}</p>
        </div>
    )
}
