// Author(s): Andrew
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/WebsiteFeedback.css";
import NavBar from "../../components/NavBar";

function WebsiteFeedback() {
  const [values, setValues] = useState({
    comment: ''
  });

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message


  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));

  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset previous errors
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');
    

    // Simple validation: check if fields are empty
    let newErrors = {};
    if (!values.comment) newErrors.comment = "Comment is required.";

    // Set errors if any
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    
    axios.post("http://localhost:5001/user/feedback/addwebsitefeedback", {feedbackContent: values})
    .then(res => {
        setValues({
        comment: ''
        });
        setSuccessMessage("Feedback submitted successfully!");
    
    })
    .catch(err => {
        console.log(err);
        setErrorMessage("An error occurred. Please try again.");
    });
    
  };


  return (
    <div>
        <NavBar />
        <div id="WebsiteFeedbackFormContainer">
            <h1>Website Feedback</h1>
            <form action='' onSubmit={handleSubmit}>
                <div className="messageContainer">
                    {successMessage && <p className="successLabel">{successMessage}</p>}
                    {errorMessage && <p className="errorLabel">{errorMessage}</p>}
                </div>
                <div className="formGroup">
                    <label htmlFor="comment" className="inputLabel">Comment</label>
                    <textarea
                    placeholder="Enter your comment here"
                    name="comment"
                    value={values.comment}
                    onChange={handleInput}
                    className="inputBox"
                    rows="4"
                    />
                    {errors.comment && <span className="error-message">{errors.comment}</span>}
                </div>
        
                <div className="submitButton">
                    <button className="submit-button">Submit</button>
                </div>
            </form>
        </div>
    </div>
  );
  
}

export default WebsiteFeedback