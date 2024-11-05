import React from 'react';
import "./styles/HistoryCard.css";

export const HistoryCard = (props) => {
 
  
  const formatDate = (timestamp) => {
    const date = new Date(Date.parse(timestamp)); // Parse without timezone conversion
  
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  
  

  console.log(props);

  return (
    <div className='historyCard'>
      <p><strong>With : </strong> {props.otherUserEmail}</p>
      <p><strong>Title: </strong> {props.title}</p>
      <p><strong>Category, Difficulty: </strong>{props.category}, {props.complexity}</p>
      <p><strong>Question: </strong> {props.description}</p>
      <p className='fromText'> {formatDate(props.timestamp)}</p>
    </div>
  );
};
