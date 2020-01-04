import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Form.css";
import { Button, PseudoBox } from "@chakra-ui/core";
import { Box, Heading } from "@chakra-ui/core";

const Signup = props => {
  const [error, setError] = useState();

  const [input, setInput] = useState({
    username: "",
    password: ""
  });

  const handleChange = e => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = e => {
    e.preventDefault();
    axios
      .post("https://hackathon-livenotes.herokuapp.com/users", input)
      .then(res => {
        console.log("login submit results", res);
        setError(false);
        // window.localStorage.setItem('token', JSON.stringify(res.data.access_token))
        props.history.push("/login");
      })
      .catch(err => {
        console.error(err.response.data.message);
        setError(err.response.data.message);
        //   setError(err.data.message)
        //   console.log(err.data.message)
      });
  };
  if (error === false) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Thanks for signing up!",
      showConfirmButton: false,
      timer: 1500
    });
  }

  //   if(token){
  //     return <Redirect to="/"/>
  //   }
  return (
    <div className="col-container">
      <div className="col1">
        <div className="heading-container">
          <Heading as="h1">Where to next?</Heading>
          <strong>
            <p>Welcome Back!</p>
            <p>Please sign in </p>
            <p>with your info.</p>
          </strong>
          <Link to="/login">
            <PseudoBox
              as="button"
              height="44px"
              width="80%"
              lineHeight="1.2"
              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
              // border="1px"
              px="8px"
              rounded="22px"
              fontSize="14px"
              fontWeight="semibold"
              bg="#3182ce"
              // borderColor="#ccd0d5"
              color="#ffffff"
              // _hover={{ bg: "#ebedf0" }}
              _active={{
                bg: "#dddfe2",
                transform: "scale(0.98)",
                borderColor: "#bec3c9"
              }}
              _focus={{
                boxShadow:
                  "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)"
              }}
            >
              Login
            </PseudoBox>
          </Link>
        </div>
      </div>
      <div className="col2">
        <Box
          p={5}
          shadow="lg"
          borderWidth="2px"
          rounded="lg"
          className="form-container"
        >
          <h1 className="heading">Create an account.</h1>
          <div className="auth-links">
            <div>{error}</div>
          </div>
          <form onSubmit={handleLoginSubmit} className="signup-form">
            <input
              className="form-input"
              placeholder="Username"
              onChange={handleChange}
              name="username"
              value={input.username}
            />

            <input
              className="form-input"
              placeholder="Password"
              name="password"
              value={input.password}
              onChange={handleChange}
              type="password"
            />
            <Button
              variantColor="teal"
              width="60%"
              rounded="20px"
              onClick={handleLoginSubmit}
            >
              Sign up
            </Button>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default Signup;
