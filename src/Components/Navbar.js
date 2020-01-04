import React,{useState,useEffect, useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'

import HistoryContext from '../contexts/HistoryContext';

import './Navbar.scss';

export default function Navbar() {
    const [token,setToken] = useState(false);

    const { setHistory } = useContext(HistoryContext);

    useEffect(() => {
        setToken(localStorage.getItem("token"))

        // document.location.reload(true)
        },[])

    return (
        <div className='navbar'>
            <Link onClick={() => setHistory([])} to='/'><h2 className='title'>LiveNotes</h2></Link>
            <NavLink onClick={() => setHistory([])} to ="/new" activeClassName='active-item'>
                New Transcript
            </NavLink>
            <NavLink onClick={() => setHistory([])} exact to="/" activeClassName='active-item'>
                Saved Transcripts
            </NavLink>
            {token === null ? (
            <NavLink onClick={() => setHistory([])} to="/login" activeClassName="active-item">
              login
            </NavLink>
          ) : (
            <NavLink onClick={() => setHistory([])} to="/login" activeClassName="active-item">
              <div
                className="btn"
                type="submit"
                onClick={() => {
                  localStorage.removeItem("token");
                  setToken(null);
                }}
              >
                Logout
              </div>
            </NavLink>
          )}
        </div>
    )
}
