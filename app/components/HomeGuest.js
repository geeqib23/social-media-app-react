import React, { useState } from "react";
import Container from "./Container";
import Page from "./Page";
import Axios from "axios";
import HeaderLoggedIn from "./HeaderLoggedIn";
// import e from "express";

function HomeGuest() {
  const [username, setusername] = useState();
  const [email, setemail] = useState();
  const [pass, setpass] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(e.target); //(this) waala method use for vanilla js only, here use e.target
    // alert("FUCK YES");
    try {
      await Axios.post("http://localhost:8080/register", {
        username, //shorthand if name is same
        password: pass,
        email,
      });
      console.log("successfully created account");
    } catch (e) {
      console.log(e.response.data);
    }
  }

  return (
    <Page title="Home" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                onChange={(e) => setusername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                onChange={(e) => setemail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                onChange={(e) => setpass(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default HomeGuest;
