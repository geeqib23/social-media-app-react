import React, { useEffect, useState, useContext } from "react"
import { Link, useParams, withRouter } from "react-router-dom"
import Page from "./Page"
import Axios from "axios"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import LoadingDots from "./LoadingDots"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost(props) {
  const [isLoading, setLoading] = useState(true)
  const { id } = useParams()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [post, setPost] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { CancelToken: ourRequest.token })
        // console.log(response.data);
        setPost(response.data)
        setLoading(false)
      } catch (e) {
        console.log("THERE WAS A PROBLEM")
      }
    }
    fetchPost()
    return () => ourRequest.cancel()
  }, [])

  const date = new Date(post.createdDate)
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

  const isOwner = () => {
    return post.author.username == appState.user.username
  }

  const deleteHandler = async () => {
    try {
      const response = await Axios.delete(`post/${id}`, { data: { token: appState.user.token } })
      console.log(response)
      if (response.data == "Success") {
        appDispatch({ type: "flashMessage", value: "Post has been deleted successfully" })
        props.history.push(`/profile/${appState.user.username}`)
      }
    } catch (e) {
      console.log("Something went wrong")
    }
  }

  if (!isLoading && !post) return <NotFound />

  if (isLoading) return <LoadingDots />

  return (
    <Page title={`Post-${post.title}`}>
      <div className="container container--narrow py-md-5">
        <div className="d-flex justify-content-between">
          <h2>{post.title}</h2>
          {isOwner() && ( //cant put if else in JSX(only javascript expressions, not statements)
            <span className="pt-2">
              <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
                <i className="fas fa-edit"></i>
              </Link>
              <ReactTooltip id="edit" />
              <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
                <i className="fas fa-trash"></i>
              </a>
              <ReactTooltip id="delete" className="custom-tooltip" />
            </span>
          )}
        </div>

        <p className="text-muted small mb-4">
          <Link to={`/profile/${post.author.username}`}>
            <img className="avatar-tiny" src={post.author.avatar} />
          </Link>
          Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {formattedDate}
        </p>

        <div className="body-content">
          <ReactMarkdown source={post.body} allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]} />
        </div>
      </div>
    </Page>
  )
}

export default withRouter(ViewSinglePost)
