import React, { useState, useReducer, useEffect, Suspense } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"
Axios.defaults.baseURL = process.env.BACKENDURL || "https://social-media-app-react.herokuapp.com"
import { useImmerReducer } from "use-immer"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// My Components
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
const CreatePost = React.lazy(() => import("./components/CreatePost"))
// import CreatePost from "./components/CreatePost"
import Axios from "axios"
import FlashMessage from "./components/FlashMessage"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"
import Search from "./components/Search"
// import Chat from "./components/Chat"
import LoadingDots from "./components/LoadingDots"
const Chat = React.lazy(() => import("./components/Chat"))
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"))

function Main() {
  // const [loginStatus, setLoginStatus] = useState(Boolean(localStorage.getItem("token")));
  // const [flashMessage, setFlashMessage] = useState([]);

  // function addFlashMessage(msg) {
  //   setFlashMessage((prev) => prev.concat(msg));
  // }

  function useReduce(draft, action) {
    //draft instead of state(as in normal reducer)
    switch (action.type) {
      case "login":
        // return { loginStatus: true, flashMessage: state.flashMessage };
        draft.user = action.data
        draft.loginStatus = true
        break
      case "logout":
        // return { loginStatus: false, flashMessage: state.flashMessage };
        draft.loginStatus = false
        break
      case "flashMessage":
        // return { loginStatus: state.loginStatus, flashMessage: state.flashMessage.concat(action.value) };
        draft.flashMessage.push(action.value)
        break
      case "toggleShowSearch":
        if (draft.showSearch) draft.showSearch = false
        else draft.showSearch = true
        break
      case "closeChat":
        draft.showChat = false
        return
      case "toggleChat":
        draft.showChat = !draft.showChat
        return
      case "increaseUnread":
        draft.unreadCount++
        return
      case "resetUnread":
        draft.unreadCount = 0
        break
    }
  }
  const initial = {
    unreadCount: 0,
    loginStatus: Boolean(localStorage.getItem("token")),
    flashMessage: [],

    user: {
      username: localStorage.getItem("username"),
      token: localStorage.getItem("token"),
      avatar: localStorage.getItem("avatar"),
    },
    showChat: false,
    showSearch: false,
  }
  const [state, dispatch] = useImmerReducer(useReduce, initial)

  useEffect(() => {
    if (state.loginStatus) {
      localStorage.setItem("token", state.user.token)
      localStorage.setItem("avatar", state.user.avatar)
      localStorage.setItem("username", state.user.username)
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("avatar")
      localStorage.removeItem("username")
    }
  }, [state.loginStatus])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <BrowserRouter>
          {/* <Header loginStatus={loginStatus} setLoginStatus={setLoginStatus} /> */}
          <Header />
          <FlashMessage />
          <Suspense fallback={<LoadingDots />}>
            <Switch>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route path="/" exact>
                {state.loginStatus ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/about-us">
                <About />
              </Route>
              <Route path="/terms">
                <Terms />
              </Route>
              <Route path="/create-post">
                <CreatePost />
              </Route>
              <Route path="/post/:id" exact>
                <ViewSinglePost />
              </Route>
              <Route path="/post/:id/edit" exact>
                <EditPost />
              </Route>
              {/* at the end */}
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          {state.showSearch == true ? <Search /> : undefined}
          <Footer />
        </BrowserRouter>
        <Suspense fallback="">{state.loginStatus && <Chat />}</Suspense>
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
  //forgot whyy used(so we dont have to manually reload)
  module.hot.accept()
}
