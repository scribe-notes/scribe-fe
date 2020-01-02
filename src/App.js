import React from 'react';
import Navbar from './Components/Navbar';
import { ThemeProvider } from "@chakra-ui/core";
import {Route} from 'react-router-dom';
import NewTranscript from './Components/Main/NewTranscript';
import SavedTranscripts from './Components/SavedTranscripts';
import Settings from './Components/Settings';
import Help from './Components/Help';
import Login from './Components/Login/Login'
import Signup from './Components/Login/Signup';
function App() {
  return (
    <ThemeProvider>
    <div>
      <Navbar/>
          <Route exact path = "/" component={NewTranscript}/>
          <Route exact path = "/Saved" component={SavedTranscripts}/>
          <Route exact path = "/Settings" component = {Settings}/>
          <Route exact path = "/Help" component = {Help}/>
          <Route exact path ="/Login" component ={Login}/>
          <Route exact path = "/Signup" component={Signup}/>
    </div>
    </ThemeProvider>
  );
}

export default App;
