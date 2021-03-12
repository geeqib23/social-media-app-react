import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "axios"
import { useContext } from "react"
import StateContext from "../StateContext"
import LoadingDots from "./LoadingDots"

function ProfileFollowing() {
  const { username } = useParams()
  const [isLoading, setLoading] = useState(true)
  const [followings, setFollowings] = useState([])
  const appState = useContext(StateContext)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchFollowings() {
      try {
        const response = await Axios.get(`/profile/${username}/following`, { cancelToken: ourRequest.token })
        // console.table(response.data);
        setFollowings(response.data)
        setLoading(false)
      } catch (e) {
        console.log("THERE WAS A PROBLEM or the request was cancelled")
      }
    }
    fetchFollowings()
    return () => {
      ourRequest.cancel()
    } //return statement in useEffect to do cleanup if the component is no longer being rendered
  }, [])

  if (isLoading) return <LoadingDots />

  return (
    <div className="list-group">
      {followings.map((following, index) => {
        return (
          <Link key={index} to={`/profile/${following.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={following.avatar} /> <strong>{following.username}</strong>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfileFollowing
