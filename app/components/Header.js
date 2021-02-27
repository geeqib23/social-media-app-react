import React, { useState, useContext } from "react"
import Axios from "axios"
import { Link } from "react-router-dom"
import HeaderLoggedIn from "./HeaderLoggedIn"
import HeaderLoggedOut from "./HeaderLoggedOut"
import StateContext from "../StateContext"

function Header(props) {
  // const [loginStatus, setLoginStatus] = useState(
  //   Boolean(localStorage.getItem("token"))
  // );           MOVE THIS TO MAIN.js AND PASS AS PROP to access

  const appState = useContext(StateContext)
  return (
    <header className="header-bar bg-dark mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ReactApp
          </Link>
        </h4>

        {appState.loginStatus ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
      </div>
    </header>
  )
}

export default Header
