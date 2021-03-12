import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "axios"
import { useContext } from "react"
import StateContext from "../StateContext"
import LoadingDots from "./LoadingDots"
import Post from "./Post"

function ProfilePosts() {
  const { username } = useParams()
  const [isLoading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const appState = useContext(StateContext)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
        // console.table(response.data);
        setPosts(response.data)
        setLoading(false)
      } catch (e) {
        console.log("THERE WAS A PROBLEM or the request was cancelled")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    } //return statement in useEffect to do cleanup if the component is no longer being rendered
  }, [])

  if (isLoading) return <LoadingDots />

  return <Post posts={posts} />
}

export default ProfilePosts
