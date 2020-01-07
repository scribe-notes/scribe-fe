import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar";
import { ThemeProvider } from "@chakra-ui/core";
import { Route } from "react-router-dom";
import ProtectedRoute from "./Components/_util/ProtectedRoute";
import NewTranscript from "./Components/Main/NewTranscript";
import SavedTranscripts from "./Components/SavedTranscripts";
// import Settings from "./Components/Settings";
// import Help from "./Components/Help";
import Login from "./Components/Login/Login";
import Signup from "./Components/Login/Signup";
import History from "./Components/History";
import HistoryContext from "./contexts/HistoryContext";
import UserContext from "./contexts/UserContext";

import AxiosWithAuth from "./util/AxiosWithAuth";

function App() {
  const [user, setUser] = useState({
    isLoading: true,
    data: null,
    error: null
  });

  const [history, setHistory] = useState([]);

  const setError = error => {
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

  const setLoading = () => {
    setUser({
      ...user,
      isLoading: true,
      error: null
    });
  };

  const login = ({ username, password }) => {
    setLoading(true);
    return axios
      .post(`${process.env.REACT_APP_BACKEND}/login`, { username, password })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        assignUserData(res.data);
      })
      .catch(err => {
        console.error(err);
        setError(err.response.data.message);
        return err.response.data.message;
      });
  };

  const signup = ({ email, password, username }) => {
    setLoading(true);
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
        setError(err.response.data.message);
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

  return (
    <HistoryContext.Provider value={{ history, setHistory }}>
      <UserContext.Provider value={{ user, setUser, logout, login, signup }}>
        <ThemeProvider>
          <div className="app">
            <Navbar />
            <Route path="/" render={props => <History {...props} />} />
            <ProtectedRoute exact path="/" component={SavedTranscripts} />
            <ProtectedRoute exact path="/new" component={NewTranscript} />
            {/* <Route exact path="/settings" render={props => <Settings {...props} />} />
        <Route exact path="/help" render={props => <Help {...props} />} /> */}
            <Route exact path="/login" render={props => <Login {...props} />} />
            <Route
              exact
              path="/signup"
              render={props => <Signup {...props} />}
            />
          </div>
        </ThemeProvider>
      </UserContext.Provider>
    </HistoryContext.Provider>
  );
}

export default App;
