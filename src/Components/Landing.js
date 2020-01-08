import React from 'react';
import { Redirect } from 'react-router-dom';

const Landing = props => {
  return (
    <Redirect to='/transcripts' />
  );
};

export default Landing;