// Author(s): Xiu Jia
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Route to ensure that users without ongoing collaboration cannot access collab pages
const CollaborationRestrictedRoute = () => {

  // if user does not have ongoing collaboration (and therefore no roomId in session storage),
  // redirect to another page (link to be modified/changed)
  if (!sessionStorage.roomId) {
    return (
      <Navigate to="*" />
    );
  }
  return <Outlet />;
};

export default CollaborationRestrictedRoute;