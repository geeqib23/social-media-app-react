import React, { useEffect, useContext } from "react";
import { useImmer } from "use-immer";
import StateContext from "../StateContext";
import Page from "./Page";
import Post from "./Post";
import Axios from 'axios'
import LoadingDots from "./LoadingDots";

function Home() {
  const [state, setState] = useImmer({
    isLoading : true,
    feed : []
  })
  const appState = useContext(StateContext);
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await Axios.post(`/getHomeFeed`, { token: appState.user.token }, { cancelToken: ourRequest.token });
        console.log(response.data)
        setState((draft) => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (e) {
        console.log("THERE WAS A PROBLEM or the request was cancelled");
      }
    }
    fetchData();
    return () => ourRequest.cancel();
  }, []);

  if(state.isLoading == true)
  return <LoadingDots />
  return (
    
    <Page title="Home">
      {state.feed.length == 0 && (
      <div>
        <h2 className="text-center">
        Hello <strong>{appState.user.username}</strong>, your feed is empty.
        </h2>
      
        <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
      </div>
      )}

      {state.feed.length != 0 && (
        <Post posts = {state.feed} />
      )}

      


    </Page>
  );
}

export default Home;
