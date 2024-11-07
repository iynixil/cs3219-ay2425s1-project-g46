import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "./styles/Profile.css";
import { ReviewCard } from '../../components/ReviewCard';
import AvatarImage from '../../components/AvatarImage';
import useSessionStorage from '../../hook/useSessionStorage';

function Profile() {
  const [values, setValues] = useState({
    username: '',
    email: '',
  });

  const [reviews, setReviews] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const email = useSessionStorage("", "email")[0];

  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      console.log(`Fetching profile for email: ${email} from URL: http://localhost:5001/user/profile/${email}`);
      fetch(`http://localhost:5001/user/profile/${email}`)
        .then((response) => {
          console.log('Response status:', response.status);
          if (!response.ok) {
            throw new Error(`Profile data could not be fetched. Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched user data:', data); // Log the received data
          setValues({
            username: data.username,
            email: data.email,
          });
          setAvatarUrl(data.image || null); // Set avatar URL if available, otherwise null
          setProfileLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setProfileLoading(false);
        });
    } else {
      console.error('Email is not found in sessionStorage');
      setProfileLoading(false);
    }
  }, [email]);

  //The below should be for reviews. 
  // Fetch reviews
  useEffect(() => {
    if (email) {
      fetch(`http://localhost:5004/feedback/getuserreview/${email}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Review data could not be fetched. Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched review data:', data);
          const reviewsArray = Object.values(data || {}); 
          setReviews(reviewsArray);
          setReviewsLoading(false);
        })
        
        
        .catch((error) => {
          console.error("Error fetching reviews:", error);
          setReviewsLoading(false);
        });
    } else {
      setReviewsLoading(false);
    }
    
  }, [email]); 

  if (profileLoading || reviewsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div id="profileContainer">
        <h1>My Profile</h1>
        <div className='profile-group'>
          <div className='avatar-center'>
            <AvatarImage avatarUrl={avatarUrl} email={email} />
          </div>
          <div>
            <h1 id='username'>{values.username}</h1>
            <h2 id='email'>{values.email}</h2>
          </div>
        </div>
        
        <div className='button-group'>
          <button class="history-button" onClick={() => navigate('/user/matchinghistory')} >Matching History</button>
          <button class="website-feedback-button" onClick={() => navigate('/feedback/websitefeedback')} >Website Feedback</button>
          <button class="change-password-button" onClick={() => navigate('/user/changepassword')} >Change Password</button>
        </div>

        <div className="reviews-container">
          <h1 className="reviews-title">Reviews</h1>
          {reviews.length > 0 ? (
            Object.entries(reviews).map(([key, review]) => (
              <ReviewCard
                key={key} 
                rating={review.rating}
                comment={review.comment}
                by={review.by}
                timestamp={review.timestamp}
              />
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
