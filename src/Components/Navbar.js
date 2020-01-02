import React,{useState,useEffect} from 'react'
import styled from 'styled-components';
import {Link} from 'react-router-dom'


const NavContainer = styled.div`
display:flex;
justify-content:flex-start;
align-items:center;
border-bottom: 2px solid black;
background:#3082CE;

`

const Logout = styled.button`
background:#4e9af1;
display:inline-block-size;
padding: 0.3em 1.2em;
margin:0 0.1em 0.1em 0;
border:0.16em solid rgba(255,255,255,0);
 border-radius:2em;
 box-sizing: border-box;
 text-transform:uppercase;
 font-weight:300;
 color:#FFFFFF;
 text-shadow: 0 0.04em 0.04em rgba(0,0,0,0.35);
 text-align:center;
 transition: all 0.2s;
border-color:rgba(255,255,255,1)
:hover{
border-color:black;
}
`
const Icon = styled.h1`
margin:5px;



`


const NavItem = styled(Link)`
/* color:black; */
color:white;
text-decoration:none;
margin:2%;

:visited{
    color:white;
    text-decoration:none;
}

`
export default function Navbar() {
    const [token,setToken] = useState(false);
     const [loginstate,setLoginstate]=useState()

    useEffect(() => {
        setToken(localStorage.getItem("token"))
        },[])

    return (
        <NavContainer>
            <Icon>ReactApp</Icon>
            <NavItem to ="/">
                New Transcript
            </NavItem>
            <NavItem to="/Saved">
                Saved Transcripts
            </NavItem>
            <NavItem to="/Settings">
                Settings
            </NavItem>
            <NavItem to ="/Help">
                Help
            </NavItem>
            {token === null ? (
            <NavItem to="/login" activeClassName="active-Item">
              login
            </NavItem>
          ) : (
            <NavItem to="/login" activeClassName="active-Item">
              <Logout
                className="btn"
                type="submit"
                onClick={() => {
                  localStorage.removeItem("token");
                  setToken(null);
                }}
              >
                Logout
              </Logout>
            </NavItem>
          )}
        </NavContainer>
    )
}
