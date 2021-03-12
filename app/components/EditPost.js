import React, { useEffect, useState, useContext } from "react"
import { Link, useParams, withRouter } from "react-router-dom"
import Page from "./Page"
import Axios from "axios"
import ReactMarkdown from "react-markdown"
import { useImmerReducer } from "use-immer"
import LoadingDots from "./LoadingDots"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound"
import ProfilePosts from "./ProfilePosts"

function EditPost(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const OriginalState = {
    title: {
      value: "",
      hasError: false,
      message: "",
    },
    body: {
      value: "",
      hasError: false,
      message: "",
    },
    isFetching: true,
    isSaving: true,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "Fetched":
        draft.isFetching = false
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        break
      case "updateBody":
        draft.body.value = action.value
        break
      case "updateTitle":
        draft.title.value = action.value
        break
      case "Submit":
        if (!draft.body.hasError && !draft.title.hasError) draft.sendCount++
        //bad habit to send axios request in reducer. DO IT IN USE EFFECT
        break
      case "PostUpdated":
        draft.isSaving = false
        appDispatch({ type: "flashMessage", value: "Congrats, your post has been updated" })
        break
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasError = true //use trim to make sure blank spaces are also excluded
          draft.title.message = "Title can't be blank"
        } else draft.title.hasError = false
        //below condition was just for demontration(wont work perfectly)
        if (action.value.length > 25) {
          //Actual validation is done in backend(so pressing enter button will still update for this condition)
          draft.title.hasError = true
          draft.title.message = "Title should be less than 25 characters"
        }
        return
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasError = true
          draft.body.message = "Body can't be empty"
        } else draft.body.hasError = false
        return
      case "Not Found":
        draft.notFound = true
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, OriginalState)

  // if (!state.body.value) dispatch({ type: "Empty body" });
  // if (!state.title.value) dispatch({ type: "Empty title" });WRONG

  useEffect(() => {
    if (state.sendCount) {
      const ourRequest = Axios.CancelToken.source()
      async function updatePost() {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token })
          console.log("Post Updated", response.data)
          dispatch({ type: "PostUpdated" })
        } catch (e) {
          console.log("THERE WAS A PROBLEM or the request was cancelled")
        }
      }
      updatePost()
      return () => ourRequest.cancel()
    }
  }, [state.sendCount])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
        // console.log(response.data)
        if (response.data) dispatch({ type: "Fetched", value: response.data })
        else dispatch({ type: "Not Found" })

        if (response.data.author.username != appState.user.username) {
          appDispatch({ type: "flashMessage", value: "You dont have the permission to edit the post" })
          //redirecting to home page
          props.history.push("/")
        }
      } catch (e) {
        console.log("THERE WAS A PROBLEM or the request was cancelled")
      }
    }
    fetchPost()
    return () => ourRequest.cancel()
  }, [])

  function HandleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "titleRules", value: state.title.value }) //checking for title rules when submitted through rnter key coz onBlur didnt trigger
    dispatch({ type: "bodyRules", value: state.body.value }) //checking for body rules when submitted through rnter key coz onBlur didnt trigger
    dispatch({ type: "Submit" })
  }
  if (state.notFound) return <NotFound />
  if (state.isFetching) return <LoadingDots />

  return (
    <Page title="Edit Post">
      <Link to={`/post/${state.id}`}>&laquo; Back to view post</Link>
      <form className="mt-3" onSubmit={HandleSubmit}>
        {/* fayda of using useReducer(functions of onchange/onsubmit  remain organised at one place) */}{" "}
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={(e) => dispatch({ type: "titleRules", value: e.target.value })} onChange={(e) => dispatch({ type: "updateTitle", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasError && <div className="alert alert-danger liveValidateMessage small">{state.title.message}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={(e) => dispatch({ type: "bodyRules", value: e.target.value })} onChange={(e) => dispatch({ type: "updateBody", value: e.target.value })} value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
          {state.body.hasError && <div className="alert alert-danger liveValidateMessage small">{state.body.message}</div>}
        </div>
        <button className="btn btn-primary" disabled={!state.isSaving}>
          Save updates
        </button>
      </form>
    </Page>
  )
}

export default withRouter(EditPost)
