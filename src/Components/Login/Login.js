import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, PseudoBox } from "@chakra-ui/core";
import { Box, Heading } from "@chakra-ui/core";
import UserContext from "../../contexts/UserContext";
import "./LoginForm.scss";

const Login = props => {
  const [input, setInput] = useState({
    username: "",
    password: ""
  });

  const userContext = useContext(UserContext);

  const handleChange = e => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = e => {
    e.preventDefault();

    userContext.login(input)
    .then(() => {
      if (!userContext.error) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Welcome to Live Notes!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  };

  if (userContext.user.data)
    return <Redirect to="/" />;

  return (
    <div className="login">
      <div className="left">
        <Box
          p={5}
          shadow="lg"
          borderWidth="2px"
          rounded="lg"
          className="form-container"
        >
          <h1 className="heading">Log in to your account</h1>
          <form onSubmit={handleLoginSubmit} className="login-form">
            <input
              disabled={userContext.user.isLoading}
              className="form-input"
              placeholder="Username"
              onChange={handleChange}
              name="username"
              value={input.username}
            />
            <input
              disabled={userContext.user.isLoading}
              className="form-input"
              placeholder="Password"
              name="password"
              value={input.password}
              onChange={handleChange}
              type="password"
            />
            <Button
              disabled={userContext.user.isLoading}
              variantColor="teal"
              width="60%"
              rounded="20px"
              type='submit'
            >
              Login
            </Button>
          </form>
          <div className="error">{userContext.error}</div>
        </Box>
      </div>
      <div className="right">
        <Heading as="h1">New around here?</Heading>
        <strong>
          <p>Please create a new user account</p>
        </strong>
        <Link to="/signup">
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
            bg="white"
            color="#319795"
            // _hover={{ bg: "#ebedf0" }}
            _active={{
              bg: "#rgb(166, 231, 228);",
              transform: "scale(0.98)",
              borderColor: "#bec3c9"
            }}
            _focus={{
              boxShadow:
                "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)"
            }}
            _hover={{
              bg: "#3bc2c2",
              color: "white"
            }}
          >
            Sign Up
          </PseudoBox>
        </Link>
      </div>
    </div>
  );
};

export default Login;
