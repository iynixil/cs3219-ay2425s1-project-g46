// Author(s): Andrew
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/MatchingHistory.css";
import NavBar from "../../components/NavBar";
import { HistoryCard } from '../../components/HistoryCard';
import useSessionStorage from "../../hook/useSessionStorage";

export default function MatchingHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  
  const email = useSessionStorage("", "email")[0];

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await axios.post("http://localhost:5001/user/profile/gethistory", { email });
        console.log("Response", response);
        if (response.data.message !== 'No matching history made.') {
            setHistoryData(response.data); 
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matching history data:", error);
        setErrorMessage("Failed to load matching history data.");
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="matchingHistoryContainer">
        <h1>Matching History</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {Object.keys(historyData).length > 0 ? (
            Object.entries(historyData).map(([key, historyData]) => (
              <HistoryCard
                key={key} 
                historyData={historyData}
              />
            ))
          ) : (
            <p>No matching history available</p>
          )}
      </div>
    </div>
  );
}
