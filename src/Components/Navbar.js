import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import HistoryContext from "../contexts/HistoryContext";
import UserContext from "../contexts/UserContext";

import { Spinner } from '@chakra-ui/core';

import "./Navbar.scss";

export default function Navbar() {

  const { setHistory } = useContext(HistoryContext);
  const userContext = useContext(UserContext);

  return (
    <div className="navbar">
      <Link onClick={() => setHistory([])} to="/">
        <h2 className="title">scribe</h2>
      </Link>
      <NavLink
        onClick={() => setHistory([])}
        exact
        to="/"
        activeClassName="active-item"
      >
        My Transcripts
      </NavLink>
      <NavLink
        onClick={() => setHistory([])}
        to="/new"
        activeClassName="active-item"
      >
        New Transcript
      </NavLink>
      {userContext.user.isLoading ? <Spinner /> : userContext.user.data === null ? (
        <Link
          onClick={() => setHistory([])}
          to="/login"
        >
          Log In
        </Link>
      ) : (
          <div
            className="btn"
            type="submit"
            onClick={() => {
              setHistory([]);
              localStorage.removeItem("token");
              userContext.logout();
            }}
          >
            Logout
          </div>
      )}
    </div>
  );
}
