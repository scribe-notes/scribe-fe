import React,{useState,useEffect} from 'react'
import {Link, NavLink} from 'react-router-dom'

import './Navbar.scss';

export default function Navbar() {
    const [token,setToken] = useState(false);
     const [loginstate,setLoginstate]=useState()
        let counter = 0
    useEffect(() => {
        setToken(localStorage.getItem("token"))

        // document.location.reload(true)
        },[])

    return (
        <div className='navbar'>
            <Link to='/'><h2 className='title'>LiveNotes</h2></Link>
            <NavLink to ="/new" activeClassName='active-item'>
                New Transcript
            </NavLink>
            <NavLink exact to="/" activeClassName='active-item'>
                Saved Transcripts
            </NavLink>
            {token === null ? (
            <NavLink to="/login" activeClassName="active-item">
              login
            </NavLink>
          ) : (
            <NavLink to="/login" activeClassName="active-item">
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
