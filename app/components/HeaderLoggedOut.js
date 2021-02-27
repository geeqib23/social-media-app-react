import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function HeaderLoggedOut(props) {
  const [username, setusername] = useState();
  const [password, setpassword] = useState();
  const dispatch = useContext(DispatchContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:8080/login", {
        username,
        password,
      });
      if (response.data) {
        console.log(response.data);
        // localStorage.setItem("status", "true");
        dispatch({ type: "login", data: response.data });
      } else console.log("INCORRECT USERNAME/PASS");
    } catch (e) {
      console.log("There was a problem");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
        <div className="row align-items-center">
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input onChange={(e) => setusername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
          </div>
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input onChange={(e) => setpassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
          </div>
          <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Sign In</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default HeaderLoggedOut;
