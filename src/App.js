import React from 'react';
import Navbar from './Components/Navbar';
import {Route} from 'react-router-dom';
import NewTranscript from './Components/Main/NewTranscript';
import SavedTranscripts from './Components/SavedTranscripts';
import Settings from './Components/Settings';
import Help from './Components/Help';

function App() {
  return (
    <div>
      <Navbar/>
          <Route exact path = "/" component={NewTranscript}/>
          <Route exact path = "/Saved" component={SavedTranscripts}/>
          <Route exact path = "/Settings" component = {Settings}/>
          <Route exact path = "/Help" component = {Help}/>
    </div>
  );
}

export default App;
