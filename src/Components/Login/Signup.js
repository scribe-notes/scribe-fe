import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import Swal from "sweetalert2";
import "./Form.scss";
import { Button, PseudoBox } from "@chakra-ui/core";
import { Box, Heading } from "@chakra-ui/core";

const Signup = () => {
  const [error, setError] = useState(null);

  const [input, setInput] = useState({
    email: "",
    username: "",
    password: "",
    password_confirmation: ""
  });

  const userContext = useContext(UserContext);

  const handleChange = e => {
    setError('');
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = e => {
    e.preventDefault();
    setError(null);
    if (input.password !== input.password_confirmation)
      return setError("Passwords do not match!");

    userContext.signup(input)
    .then(err => {
      if (!err) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Welcome to Live Notes!",
          showConfirmButton: false,
          timer: 1500
        });
      } else setError(err);
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

  if (userContext.user.data) {
    return <Redirect to="/" />;
  }
  return (
    <div className="signup">
      <div className="left">
        <Heading as="h1">Already registered?</Heading>
        <strong>
          <p>Welcome Back!</p>
          <p>Please sign in to your account below</p>
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
            bg="white"
            // borderColor="#ccd0d5"
            color="#319795"
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
            _hover={{
              bg: "#3bc2c2",
              color: "white"
            }}
          >
            Login
          </PseudoBox>
        </Link>
      </div>
      <div className="right">
        <Box
          p={5}
          shadow="lg"
          borderWidth="2px"
          rounded="lg"
          className="form-container"
        >
          <h1 className="heading">Create an account</h1>
          <form onSubmit={handleLoginSubmit} className="signup-form">
            <input
              disabled={userContext.user.isLoading}
              className="form-input"
              placeholder="Email"
              value={input.email}
              name="email"
              onChange={handleChange}
              type="email"
            />
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
            <input
              disabled={userContext.user.isLoading}
              className="form-input"
              placeholder="Confirm Password"
              name="password_confirmation"
              value={input.password_confirmation}
              onChange={handleChange}
              type="password"
            />
            <span className="help">
              Password must be at least 8 characters long.
            </span>
            <Button
              disabled={userContext.user.isLoading}
              variantColor="teal"
              width="60%"
              marginTop="8px"
              rounded="8px"
              type='submit'
            >
              Sign up
            </Button>
            <div className="error">
              {error}
            </div>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default Signup;
