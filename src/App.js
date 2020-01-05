import React from "react";
import Navbar from "./Components/Navbar";
import { ThemeProvider } from "@chakra-ui/core";
import { Route } from "react-router-dom";
import NewTranscript from "./Components/Main/NewTranscript";
import SavedTranscripts from "./Components/SavedTranscripts";
// import Settings from "./Components/Settings";
// import Help from "./Components/Help";
import Login from "./Components/Login/Login";
import Signup from "./Components/Login/Signup";
import History from './Components/History'
import ShareTranscripts from "./Components/ShareTranscripts";

function App() {
  return (
    <ThemeProvider>
      <div>
        <Navbar />
        <Route path="/" render={props => <History {...props} />} />
        <Route exact path="/" render={props => <SavedTranscripts {...props} />} />
        <Route exact path="/new" render={props => <NewTranscript {...props} />} />
        <Route exact path = "/share" render = {props => <ShareTranscripts {...props}/>}/>

        <Route exact path="/login" render={props => <Login {...props} />} />
        <Route exact path="/signup" render={props => <Signup {...props} />} />
      </div>
    </ThemeProvider>
  );
}

export default App;
