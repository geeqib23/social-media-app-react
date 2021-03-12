import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useContext } from "react/cjs/react.development"
import DispatchContext from "../DispatchContext"
import Axios from "axios"
import { useImmer } from "use-immer"

function Search() {
  const dispatch = useContext(DispatchContext)
  // const [matchPosts, setMatchPosts] = useState([]); //useImmer BESTT(midddle ground between useState and useImmerReducer)
  const [state, setState] = useImmer({
    matchPosts: [],
    searchTerm: "",
    requestCount: 0,
  })

  // useEffect(() => {
  //   const ourRequest = Axios.CancelToken.source()
  //   if (state.requestCount) {
  //     async function fetchResults() {
  //       try {
  //         const posts = await Axios.post("/search", { searchTerm: state.searchTerm }, { CancelToken: ourRequest.token })
  //         console.log(posts)
  //       } catch (e) {
  //         console.log(e, "error")
  //       }
  //     }
  //     fetchResults()
  //   }
  //   return () => ourRequest.cancel()
  // }, [state.requestCount])

  useEffect(() => {
    const delay = setTimeout(() => {
      setState((draft) => {
        console.log(state.searchTerm)
        draft.requestCount++
      }) //making axios req in separate useEffect so we can cancel it also if component unrenders
    }, 1000)

    return () => clearTimeout(delay) //cleanup funtion if the user changes input before the delay
  }, [state.searchTerm])

  function handleInput(e) {
    const value = e.target.value
    setState((draft) => {
      //must include {} with setState arrow callback(we dont have to return)
      draft.searchTerm = value
    })
    // setMatchPosts(posts.filter((post) => post.title.match(/e.target.value/gi))); SILLY ME :]
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={() => dispatch({ type: "toggleShowSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="text-centre">Search doesn't work yet :(</div>
      {/* <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className="live-search-results live-search-results--visible">
            <div className="list-group shadow-sm">
              <div className="list-group-item active"><strong>Search Results</strong> ({matchPosts.length} items found)</div> */}
      {/* {matchPosts.map((post) => {
                const date = new Date(post.createdDate);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                return (
                  <Link to={`post/${post._id}`} className="list-group-item list-group-item-action">
                    <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>
                    <span className="text-muted small">
                      by {post.author.username} on {formattedDate}{" "}
                    </span>
                  </Link>
                );
              })} */}
      {/* <a href="#" className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #1</strong>
                <span className="text-muted small">by brad on 2/10/2020 </span>
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128" /> <strong>Example Post #2</strong>
                <span className="text-muted small">by barksalot on 2/10/2020 </span>
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #3</strong>
                <span className="text-muted small">by brad on 2/10/2020 </span>
              </a>

            </div>
          </div>
        </div>
            </div> */}
    </div>
  )
}

export default Search
