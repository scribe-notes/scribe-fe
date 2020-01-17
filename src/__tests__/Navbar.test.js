import React from "react";
import Navbar from '../Navbar'
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from "react-router-dom";

it("Snapshot test for Login page", () => {
  const tree = renderer
    .create(
      <Router>
        <Navbar />
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});