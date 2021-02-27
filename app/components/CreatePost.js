import React, { useState, useEffect, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreatePost(props) {
  const [title, updateTitle] = useState();
  const [body, updateBody] = useState();

  const dispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      //using short url :) due to set baseURL
      const response = await Axios.post("/create-post", {
        title,
        body,
        token: appState.user.token,
      });
      //redirecting to "/post/someid"
      dispatch({ type: "flashMessage", value: "Congo, You created a post" });
      props.history.push(`/post/${response.data}`);
      console.log("POST CREATED");
    } catch (e) {
      console.log("ERROR");
    }
  }
  return (
    <Page title="Create Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={(e) => updateTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {/* {state.title.hasError && <div className="alert alert-danger liveValidateMessage small">{state.title.message}</div>} */}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={(e) => updateBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
}

export default withRouter(CreatePost); //gives access to this.props.history
