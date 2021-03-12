import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "axios"
import { useContext } from "react"
import StateContext from "../StateContext"
import LoadingDots from "./LoadingDots"

function ProfileFollowers() {
  const { username } = useParams()
  const [isLoading, setLoading] = useState(true)
  const [followers, setFollowers] = useState([])
  const appState = useContext(StateContext)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchFollowers() {
      try {
        const response = await Axios.get(`/profile/${username}/followers`, { cancelToken: ourRequest.token })
        // console.table(response.data)
        setFollowers(response.data)
        setLoading(false)
      } catch (e) {
        console.log("THERE WAS A PROBLEM or the request was cancelled")
      }
    }
    fetchFollowers()
    return () => {
      ourRequest.cancel()
    } //return statement in useEffect to do cleanup if the component is no longer being rendered
  }, [])

  if (isLoading) return <LoadingDots />

  return (
    <div className="list-group">
      {followers.map((follower, index) => {
        return (
          <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} /> <strong>{follower.username}</strong>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfileFollowers
