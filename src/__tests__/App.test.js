import React from "react";
import App from './App'
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from "react-router-dom";

it("Snapshot test for Login page", () => {
  const tree = renderer
    .create(
      <Router>
        <App />
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});