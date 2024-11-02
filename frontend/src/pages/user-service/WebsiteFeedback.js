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

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));

  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset previous errors
    setErrors({});

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
    })
    .catch(err => {
        if (err.response && err.response.data.message) {
        setErrors(preErrors => ({ ...preErrors, email: err.response.data.message }));
        } else {
        console.log(err);
        }
    });
    
  };


  return (
    <div>
        <NavBar />
        <div id="WebsiteFeedbackFormContainer">
            <h1>Website Feedback</h1>
            <form action='' onSubmit={handleSubmit}>
                <div>
                    {/* Display successful message or error message after pressing the submit button*/}
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
                    {errors.comment && <span className="errorLabel">{errors.comment}</span>}
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