import React, { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function HeaderLoggedIn(props) {
  const dispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  function handleSignOut() {
    // console.log("function working");
    dispatch({ type: "logout" })
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <a onClick={() => dispatch({ type: "toggleShowSearch" })} href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span onClick={() => dispatch({ type: "toggleChat" })} className={"mr-2 header-chat-icon " + (appState.unreadCount ? "text-danger" : "text-white")}>
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> {appState.unreadCount > 9 ? "9+" : appState.unreadCount}</span>
      </span>
      <Link to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <Link to="/create-post" className="btn btn-sm btn-success mr-2">
        Create Post
      </Link>
      <Link to="/" onClick={handleSignOut} className="btn btn-sm btn-secondary">
        Sign Out
      </Link>
    </div>
  )
}

export default HeaderLoggedIn
