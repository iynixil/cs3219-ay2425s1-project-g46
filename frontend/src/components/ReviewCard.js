import React from 'react';
import "./styles/ReviewCard.css";

export const ReviewCard = (props) => {
  // Generate stars for rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} style={{ color: index < props.rating ? 'gold' : 'gray', fontSize: '20px' }}>
      ★
    </span>
  ));

  return (
    <div className='reviewCard'>
      <p><strong>Rating:</strong> {stars}</p>
      <p><strong>Comment:</strong> {props.comment}</p>
      <p className='fromText'><strong>From:</strong> {props.by}</p>
    </div>
  );
};
