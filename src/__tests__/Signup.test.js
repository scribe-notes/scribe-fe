import React from "react";
import Signup from '../Login/Signup'
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from "react-router-dom";

it("Snapshot test for Login page", () => {
  const tree = renderer
    .create(
      <Router>
        <Signup />
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});