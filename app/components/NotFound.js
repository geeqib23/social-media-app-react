import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center">
      <h2>This page does not exist</h2>
      <p className="lead text-muted">
        You can go back to <Link to="/">homepage</Link>{" "}
      </p>
    </div>
  );
}

export default NotFound;
