import React from "react"
import StateContext from "../StateContext"
import { Link } from "react-router-dom"
import { useContext } from "react"

function Post(props) {
  const appState = useContext(StateContext)
  return (
    <div className="list-group">
      {props.posts.map((post, index) => {
        const date = new Date(post.createdDate)
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={appState.user.avatar} /> <strong>{post.title}</strong>
            <span className="text-muted small">
              on {formattedDate} by {post.author.username}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export default Post
