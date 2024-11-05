// Author(s): Xinyi
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Route to ensure that logged-in users cannot access certain pages
const LoggedOutRoute = () => {

  // if user is logged-in (and therefore a token is stored in session storage),
  // redirect to another page (link to be modified/changed)
  if (localStorage.token) {
    return (
      <Navigate to="*" />
    );
  }
  return <Outlet />;
};

export default LoggedOutRoute;