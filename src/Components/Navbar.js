import React from 'react'
import styled from 'styled-components';
import {Link} from 'react-router-dom'


const NavContainer = styled.div`
display:flex;
justify-content:flex-start;
align-items:center;
border-bottom: 2px solid black;

`
const Icon = styled.h1`
margin:5px;


`


const NavItem = styled(Link)`
color:black;
text-decoration:none;
margin:2%;

:visited{
    color:black;
    text-decoration:none;
}

`
export default function Navbar() {

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
        </NavContainer>
    )
}
