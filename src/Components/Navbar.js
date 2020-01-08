import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import HistoryContext from "../contexts/HistoryContext";
import UserContext from "../contexts/UserContext";

import { Spinner } from "@chakra-ui/core";

import "./Navbar.scss";

export default function Navbar() {
  const { setHistory } = useContext(HistoryContext);
  const { user, logout } = useContext(UserContext);

  return (
    <div className="navbar">
      <div className="left">
        <Link onClick={() => setHistory([])} to="/transcripts">
          <h2 className="title">scribe</h2>
        </Link>
        <NavLink
          onClick={() => setHistory([])}
          to="/transcripts"
          activeClassName="active-item"
        >
          My Transcripts
        </NavLink>
        {user.isLoading ? (
          <Spinner />
        ) : user.data === null ? (
          <Link onClick={() => setHistory([])} to="/login">
            Log In
          </Link>
        ) : (
          <div
            className="btn"
            type="submit"
            onClick={() => {
              setHistory([]);
              localStorage.removeItem("token");
              logout();
            }}
          >
            Logout
          </div>
        )}
      </div>
      <div className="right">
        <div className="username">
          {user.data && (
            <span>
              Signed in as <strong>{user.data.username}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
