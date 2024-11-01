import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "../../components/NavBar";
import "./styles/Profile.css";

function Profile() {
  const [values, setValues] = useState({
    username: '',
    email: '',
  });

  const [reviews, setReviews] = useState([]);

  const [profileLoading, setProfileLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const navigate = useNavigate(); 

  const email = sessionStorage.getItem("email");

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
            username: data.username, // Assuming 'username' field in Firestore
            email: data.email
          });
          setProfileLoading(false); // Stop loading once data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setProfileLoading(false); // Stop loading in case of an error
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
      console.log(`Fetching reviews for email: ${email} from URL: http://localhost:5001/user/review/${email}`);
      fetch(`http://localhost:5001/user/review/${email}`)
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
    }
    setReviewsLoading(false);
  }, [email]); 

  if (profileLoading || reviewsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div id="signupFormContainer">
        <h1>My Profile</h1>
        <div className='avatar-wrapper'>

        </div>
        <div>
          <h1 id='username'>{values.username}</h1>
          <h1 id='username'>{values.email}</h1>
        </div>
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index}>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews available</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
