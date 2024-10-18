import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";

function MatchFound() {
  const location = useLocation();

  // Destructure the matchedData object from location.state
  const { matchedData } = location.state || { matchedData: { email: "No email", token: "No token", username: "No username" } };

  console.log("MatchFoundPage", matchedData); // Log to confirm the data is received correctly

  return (
    <div>
      <NavBar />
      <div id="MatchFoundController">
        <h1>Match Found</h1>
        <p>You have been matched with {matchedData.matchedData.username}!</p>
      </div>
    </div>
  );
}

export default MatchFound;
