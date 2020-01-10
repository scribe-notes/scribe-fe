import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar";
import { ThemeProvider } from "@chakra-ui/core";
import { Route } from "react-router-dom";
import ProtectedRoute from "./Components/_util/ProtectedRoute";
import NewTranscript from "./Components/Main/NewTranscript";
import SavedTranscripts from "./Components/SavedTranscripts";
import Landing from "./Components/Landing";
// import Settings from "./Components/Settings";
// import Help from "./Components/Help";
import Login from "./Components/Login/Login";
import Signup from "./Components/Login/Signup";
import History from "./Components/History";
import HistoryContext from "./contexts/HistoryContext";
import UserContext from "./contexts/UserContext";
import TranscriptContext from "./contexts/TranscriptContext";

import AxiosWithAuth from "./util/AxiosWithAuth";

function App() {
  const [queueTranscripts, setQueueTranscripts] = useState(false);

  const [user, setUser] = useState({
    isLoading: true,
    data: null,
    error: null
  });

  const [history, setHistory] = useState([]);

  const [transcript, setTranscript] = useState({
    isGetting: false,
    isPosting: false,
    isUpdating: false,
    error: "",
    currentTranscript: "",
    transcripts: []
  });

  const setTranscriptError = error => {
    setTranscript({
      ...transcript,
      error: error,
      isPosting: false,
      isGetting: false
    });
  };

  const setTranscriptPosting = posting => {
    setTranscript({
      ...transcript,
      error: "",
      isPosting: posting
    });
  };

  const setTranscriptUpdating = updating => {
    setTranscript({
      ...transcript,
      error: "",
      isUpdating: updating
    });
  };

  const setTranscriptGetting = getting => {
    setTranscript({
      ...transcript,
      error: "",
      isGetting: getting
    });
  };

  const setTranscripts = transcripts => {
    setTranscript({
      ...transcript,
      isGetting: false,
      isPosting: false,
      isUpdating: false,
      currentTranscript: null,
      transcripts
    });
  };

  const setCurrentTranscript = transcript => {
    setTranscript({
      ...transcript,
      isGetting: false,
      isPosting: false,
      isUpdating: false,
      currentTranscript: transcript,
      transcripts: transcript.children
    })
  }

  const fetchUpdatedData = (transcript) => {
    if(transcript.parent) return AxiosWithAuth().get(
      `${process.env.REACT_APP_BACKEND}/transcripts/${transcript.parent}
      `);
    else return AxiosWithAuth().get(
      `${process.env.REACT_APP_BACKEND}/transcripts/mine`
    );
  }

  const getTranscript = transcriptId => {
    setTranscriptGetting(true);
    return AxiosWithAuth()
      .get(`${process.env.REACT_APP_BACKEND}/transcripts/${transcriptId}`)
      .then(res => {
        setCurrentTranscript(res.data);
      })
      .catch(err => {
        console.log(err);
        setTranscriptError(err.response.data.message);
        return err.respone?.data?.message;
      });
  };

  const postTranscript = transcript => {
    setTranscriptPosting(true);
    return AxiosWithAuth()
      .post(`${process.env.REACT_APP_BACKEND}/transcripts`, transcript)
      .then(res => {
        setTranscriptPosting(false);
        return fetchUpdatedData(transcript);
      })
      .then(res => {
        if(transcript.parent)
          setCurrentTranscript(res.data);
        else setTranscripts(res.data);
      })
      .catch(err => {
        console.error(err.response.data);
        setTranscriptError(err.response.data);
        return err.response.data;
      });
  };

  const updateTranscript = transcript => {
    setTranscriptUpdating(true);
    return AxiosWithAuth()
      .put(
        `${process.env.REACT_APP_BACKEND}/transcripts/${transcript._id}`,
        transcript
      )
      .then(res => {
        return fetchUpdatedData(transcript);
      })
      .then(res => {
        if(transcript.parent)
          setCurrentTranscript(res.data);
        else setTranscripts(res.data);
      })
      .catch(err => {
        console.error(err.response);
        setTranscriptError(err.response.data.message);
      });
  };

  const deleteTranscript = transcript => {
    setTranscriptUpdating(true);
    return AxiosWithAuth()
      .delete(`${process.env.REACT_APP_BACKEND}/transcripts/${transcript._id}`)
      .then(res => {
        return fetchUpdatedData(transcript);
      })
      .then(res => {
        if(transcript.parent)
          setCurrentTranscript(res.data);
        else setTranscripts(res.data);
      })
      .catch(err => {
        console.error(err);
        return err.response.data.message;
      });
  };

  const getMyTranscripts = () => {
    if (!user.data) {
      if(user.isLoading) setQueueTranscripts(true);
      return;
    }
    setTranscriptGetting(true);
    return AxiosWithAuth()
      .get(`${process.env.REACT_APP_BACKEND}/transcripts/mine`)
      .then(res => {
        setTranscripts(res.data);
      })
      .catch(err => {
        console.log(err.response);
        setTranscriptError(err.response.data.message);
        return err.respone.data.message;
      });
  };

  const setUserError = error => {
    setUser({
      ...user,
      isLoading: false,
      error
    });
  };

  const assignUserData = data => {
    setUser({
      ...user,
      isLoading: false,
      data
    });
  };

  const setUserLoading = () => {
    setUser({
      ...user,
      isLoading: true,
      error: null
    });
  };

  const login = ({ username, password }) => {
    setUserLoading(true);
    return axios
      .post(`${process.env.REACT_APP_BACKEND}/login`, { username, password })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        assignUserData(res.data);
      })
      .catch(err => {
        console.error(err.response);
        setUserError(err.response?.data?.message);
        return err.response?.data?.message;
      });
  };

  const signup = ({ email, password, username }) => {
    setUserLoading(true);
    return axios
      .post(`${process.env.REACT_APP_BACKEND}/users`, {
        email,
        password,
        username
      })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        assignUserData(res.data);
      })
      .catch(err => {
        console.error(err.response.data.message);
        setUserError(err.response.data.message);
        return err.response.data.message;
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser({
      ...user,
      data: null
    });
  };

  const init = () => {
    if (!localStorage.getItem("token")) {
      setUser({
        ...user,
        data: null,
        isLoading: false
      });
      return;
    }
    AxiosWithAuth()
      .get(`${process.env.REACT_APP_BACKEND}/refresh`)
      .then(res => {
        setUser({
          ...user,
          data: res.data,
          isLoading: false
        });
      })
      .catch(err => {
        localStorage.removeItem("token");
        setUser({
          ...user,
          data: null,
          isLoading: false
        });
        console.log(err.response);
      });
  };

  useEffect(init, []);

  // Actions postponed until user data
  // bcomes available happen here
  const runQueue = () => {
    if(user.data !== null && queueTranscripts){
      getMyTranscripts();
      setQueueTranscripts(false);
    }
  }

  useEffect(runQueue, [user.data])

  return (
    <TranscriptContext.Provider
      value={{
        transcript,
        setTranscript,
        postTranscript,
        getMyTranscripts,
        setTranscripts,
        deleteTranscript,
        updateTranscript,
        getTranscript
      }}
    >
      <HistoryContext.Provider value={{ history, setHistory }}>
        <UserContext.Provider value={{ user, setUser, logout, login, signup }}>
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
              {/* <Route exact path="/settings" render={props => <Settings {...props} />} />
        <Route exact path="/help" render={props => <Help {...props} />} /> */}
              <Route
                exact
                path="/login"
                render={props => <Login {...props} />}
              />
              <Route
                exact
                path="/signup"
                render={props => <Signup {...props} />}
              />
            </div>
          </ThemeProvider>
        </UserContext.Provider>
      </HistoryContext.Provider>
    </TranscriptContext.Provider>
  );
}

export default App;
