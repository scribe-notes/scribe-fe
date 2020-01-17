import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import HistoryContext from "../contexts/HistoryContext";

import { Spinner } from "@chakra-ui/core";

import "./Navbar.scss";

import { connect } from 'react-redux';

import { logout } from '../actions';

const Navbar = props => {
  const { setHistory } = useContext(HistoryContext);

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
        {props.user.isLoading ? (
          <Spinner />
        ) : props.user.data === null ? (
          <Link onClick={() => setHistory([])} to="/login">
            Log In
          </Link>
        ) : (
          <div
            className="btn"
            type="submit"
            onClick={() => {
              setHistory([]);
              props.logout();
            }}
          >
            Logout
          </div>
        )}
      </div>
      <div className="right">
        <div className="username">
          {props.user.data && (
            <span>
              Signed in as <strong>{props.user.data.username}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, { logout })(Navbar);