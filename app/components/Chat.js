import React, { useContext, useEffect, useRef } from "react"
import { useImmer } from "use-immer"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import io, { Socket } from "socket.io-client"
import { BrowserRouter, Link, Router } from "react-router-dom"

// const socket = io("http://localhost:8080") we load it below so we can shut it on log out and start it at login(performance save)
function Chat(props) {
  //We dont use CSS transition group(as in Search), we want Chat to be mounted always, to receive data
  const socket = useRef(null) //not useSTate coz me dont wanna modify shit
  const chatField = useRef(null) //useRef saves us from using query selectors
  const chatLog = useRef(null)
  const appState = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    chatMessage: [],
    textField: "",
  })

  function updateField(e) {
    const value = e.target.value
    setState((draft) => {
      draft.textField = value
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    //sending message to server
    socket.current.emit("chatFromBrowser", { message: state.textField, token: appState.user.token })
    //add message to state collection of message
    setState((draft) => {
      draft.chatMessage.push({ message: state.textField, username: appState.user.username, avatar: appState.user.avatar })
      draft.textField = ""
    })
  }

  useEffect(() => {
    if (appState.showChat) {
      chatField.current.focus() //for focussing on input
    }
  }, [appState.showChat])

  useEffect(() => {
    socket.current = io(process.env.BACKENDURL || "https://social-media-app-react.herokuapp.com")

    socket.current.on("chatFromServer", (response) => {
      setState((draft) => {
        draft.chatMessage.push(response)
      })
    })

    return () => socket.current.disconnect() //disconnect on logout
  }, [])

  useEffect(() => {
    // console.log("inital" + appState.unreadCount)  surprisingly this gets executed bfore the below if
    chatLog.current.scrollTop = chatLog.current.scrollHeight
    if (!appState.showChat && state.chatMessage.length) {
      dispatch({ type: "increaseUnread" })
    }
    // console.log(appState.unreadCount) this too(ASYNC JAVASCRIPT FOR YA)
  }, [state.chatMessage])

  useEffect(() => {
    if (appState.showChat) {
      dispatch({ type: "resetUnread" })
    }
  }, [appState.showChat])

  return (
    <ref id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right" + (appState.showChat ? " chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-secondary">
        Chat
        <span onClick={() => dispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div ref={chatLog} id="chat" className="chat-log">
        {state.chatMessage.map((message, index) => {
          if (message.username == appState.user.username) {
            //can use if since under a function
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            )
          } else {
            return (
              <BrowserRouter>
                {/* dont konw why Link not working without it :| */}
                <div key={index} className="chat-other">
                  <Link to={`/profile/${message.username}`}>
                    <img className="avatar-tiny" src={message.avatar} />
                  </Link>
                  <div className="chat-message">
                    <div className="chat-message-inner">
                      <Link to={`/profile/${message.username}`}>
                        <strong>{message.username}: </strong>
                      </Link>
                      {message.message}
                    </div>
                  </div>
                </div>
              </BrowserRouter>
            )
          }
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input value={state.textField} ref={chatField} onChange={updateField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </ref>
  )
}

export default Chat
