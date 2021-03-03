import React from "react"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="border-top text-center small text-muted py-3">
      <p>
        <Link to="/" className="mx-1 ">
          Home
        </Link>{" "}
        |{" "}
        <Link className="mx-1 " to="/about-us">
          About Us
        </Link>{" "}
        |{" "}
        <Link className="mx-1 " to="/terms">
          Terms
        </Link>
      </p>
      <p className="m-0">
        Copyright &copy; 2020{" "}
        <span href="/" className="text-muted">
          ReactApp | Implemented by <a href="https://github.com/geeqib23">Aqib | </a>
        </span>
        All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
