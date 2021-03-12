import Axios from "axios"
import React, { useEffect, useContext, useState } from "react"
import Page from "./Page"
import { Switch, useParams, Link, Route, NavLink } from "react-router-dom"
import StateContext from "../StateContext"
import ProfilePosts from "./ProfilePosts"
import { useImmer } from "use-immer"
import ProfileFollowers from "./ProfileFollowers"
import ProfileFollowing from "./ProfileFollowing"

function Profile() {
  const appState = useContext(StateContext)
  const { username } = useParams()
  const [state, setState] = useImmer({
    startFollowingCount: 0,
    startUnfollowingCount: 0,
    isLoadingFollow: false,
    isLoadingFetch: true,
    requestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: "...",
      counts: {
        followerCount: "...",
        followingCount: "...",
        postCount: "...",
      },
    },
  })
  useEffect(() => {
    //we cant send an async funtion to useEffect, so workaround
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
        // console.log(response.data);
        setState((draft) => {
          draft.isLoadingFetch = false
        })
        setState((draft) => {
          draft.profileData = response.data
        })
      } catch (e) {
        console.log("THERE WAS A PROBLEM or the request was cancelled")
      }
    }
    fetchData()
    return () => ourRequest.cancel()
  }, [username])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    if (state.startFollowingCount) {
      async function follow() {
        try {
          const response = await Axios.post(`/addFollow/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
          // console.log(response.data)
          setState((draft) => {
            draft.profileData.isFollowing = true
            draft.profileData.counts.followerCount++
          })
        } catch (e) {
          console.log(e)
        }
      }
      follow()
    }
    return () => ourRequest.cancel()
  }, [state.startFollowingCount])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    if (state.startUnfollowingCount) {
      async function unfollow() {
        try {
          const response = await Axios.post(`/removeFollow/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
          console.log(response.data)
          setState((draft) => {
            draft.profileData.isFollowing = false
            draft.profileData.counts.followerCount--
          })
        } catch (e) {
          console.log(e)
        }
      }
      unfollow()
    }
    return () => ourRequest.cancel()
  }, [state.startUnfollowingCount])

  async function handleFollow() {
    setState((draft) => {
      draft.startFollowingCount++
    })
  }

  async function handleUnfollow() {
    setState((draft) => {
      draft.startUnfollowingCount++
    })
  }

  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {state.profileData.isFollowing != true && state.profileData.profileUsername != appState.user.username && state.isLoadingFollow == false && (
          <button onClick={handleFollow} className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {state.profileData.isFollowing == true && state.profileData.profileUsername != appState.user.username && state.isLoadingFollow == false && (
          <button onClick={handleUnfollow} className="btn btn-danger btn-sm ml-2">
            Unfollow <i className="fas fa-user-minus"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        {/* NavLink adds a class "active" to the active Nav */}
        {/* <NavLink to={`/profile/${username}`} className="nav-item nav-link">  */}
        <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount};
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>
      <Switch>
        <Route path="/profile/:username" exact>
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollowers />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollowing />
        </Route>
      </Switch>
    </Page>
  )
}

export default Profile
