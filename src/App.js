import React, { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import { ThemeProvider } from "@chakra-ui/core";
import { Route } from "react-router-dom";
import ProtectedRoute from "./Components/_util/ProtectedRoute";
import NewTranscript from "./Components/NewTranscript";
import SavedTranscripts from "./Components/SavedTranscripts";
import Landing from "./Components/Landing";
import Login from "./Components/Login/Login";
import Signup from "./Components/Login/Signup";
import History from "./Components/History";
import HistoryContext from "./contexts/HistoryContext";

import { connect } from "react-redux";

import { refresh } from "./actions";

const App = props => {

  const [history, setHistory] = useState([]);

  const init = () => {
    if (localStorage.getItem("token")) props.refresh();
  };

  useEffect(init, []);

  return (
    <HistoryContext.Provider value={{ history, setHistory }}>
      <ThemeProvider>
        <div className="app">
          <Navbar />
          <Route exact path="/" render={props => <Landing {...props} />} />
          <Route path="/" render={props => <History {...props} />} />
          <ProtectedRoute
            exact
            path="/transcripts"
            component={SavedTranscripts}
          />
          <ProtectedRoute
            exact
            path="/transcripts/:id"
            component={SavedTranscripts}
          />
          <ProtectedRoute exact path="/new" component={NewTranscript} />
          <ProtectedRoute exact path="/new/:id" component={NewTranscript} />
          <Route exact path="/login" render={props => <Login {...props} />} />
          <Route exact path="/signup" render={props => <Signup {...props} />} />
        </div>
      </ThemeProvider>
    </HistoryContext.Provider>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { refresh })(App);
