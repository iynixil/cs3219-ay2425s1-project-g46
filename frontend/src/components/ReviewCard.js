import React from 'react';
import "./styles/ReviewCard.css";

export const ReviewCard = ({review}) => {
  // Generate stars for rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} style={{ color: index < review.rating ? 'gold' : 'gray', fontSize: '20px' }}>
      ★
    </span>
  ));

  
  const formatDate = (timestamp) => {
    const date = new Date(Date.parse(timestamp)); // Parse without timezone conversion
  
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  

  return (
    <div className='reviewCard'>
      <p><strong>Rating:</strong> {stars}</p>
      <p><strong>Comment:</strong> {review.comment}</p>
      <p><strong>From:</strong> {review.by}</p>
      <p className='fromText'> {formatDate(review.timestamp)}</p>
    </div>
  );
};
