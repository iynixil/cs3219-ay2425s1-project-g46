import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "../../components/NavBar";
import "./styles/Profile.css";

function Profile() {
  const [values, setValues] = useState({
    username: '',
    email: '',
  });

  const [loading, setLoading] = useState(true);

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
          setLoading(false); // Stop loading once data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setLoading(false); // Stop loading in case of an error
        });
    } else {
      console.error('Email is not found in sessionStorage');
      setLoading(false);
    }
  }, [email]);
  

  if (loading) {
    return <div>Loading...</div>; // Render loading message or spinner while fetching
  }

  return (
    <div>
      <NavBar />
      <div id="signupFormContainer">
        <h1>My Profile</h1>
        <form>
          <div className='formGroup'>
            <label htmlFor='name' className='inputLabel'><strong>Name</strong></label>
            <input 
              type='text' 
              placeholder='Your username' 
              name='name' 
              value={values.username} 
              className='inputBox' 
              readOnly 
            />
          </div>
          <div className='formGroup'>
            <label htmlFor='email' className='inputLabel'><strong>Email</strong></label>
            <input 
              type='email' 
              placeholder='example@example.com' 
              name='email' 
              value={values.email} 
              className='inputBox' 
              readOnly 
            />
          </div>
          <div className="updateButton">
            <button className="update-button" disabled>Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
