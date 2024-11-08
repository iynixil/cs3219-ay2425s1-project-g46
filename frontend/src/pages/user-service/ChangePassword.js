// Author(s): Andrew
import React, { useState } from "react";
import Validation from "./utils/ChangePasswordValidation"
import axios from "axios";
import "./styles/ChangePassword.css";
import NavBar from "../../components/NavBar";

function ChangePassword() {
  const [values, setValues] = useState({
    email: sessionStorage.getItem("email"),
    oldPassword: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);
    
    setSuccessMessage('');
    setErrorMessage('');

    const email = sessionStorage.getItem("email");
    
    if (values.oldPassword !== "" &&
      values.password !== "" &&
      values.confirmPassword !== "" &&
      validationErrors.password === "" &&
      validationErrors.confirmPassword === "") {
      axios.post(`${process.env.REACT_APP_USER_API_URL}/user/profile/changepassword`, {...values, email}) // Add email here to ensure that email is always included
        .then(res => {
          setValues({
            oldPassword: '',
            password: '',
            confirmPassword: ''
          });
          setSuccessMessage('Password updated successfully.');
        })
        .catch(err => {
          if (err.response && err.response.data.message === "Old password is incorrect.") {
            setErrorMessage(err.response.data.message);
          } else {
            setErrorMessage("An error occurred. Please try again.");
            console.log(err);
          }
        });
    }
  };


  return (
    <div >
      <NavBar />
      <div id="changePasswordFormContainer">
        <h1>Change Password</h1>
        <form action='' onSubmit={handleSubmit}>

          
          <div className="messageContainer">
            {successMessage && <p className="successLabel">{successMessage}</p>}
            {errorMessage && <p className="errorLabel">{errorMessage}</p>}
          </div>
          
          <div className='formGroup'>
            <label htmlFor='oldPassword' className='inputLabel'><strong>Old Password</strong></label>
            <input type='password' placeholder='Old Password' name='oldPassword' value={values.oldPassword} onChange={handleInput} className='inputBox' />
            {errors.oldPassword && <span className='error-label'> {errors.password}</span>}
          </div>
          <div className='formGroup'>
            <label htmlFor='password' className='inputLabel'><strong>Password</strong></label>
            <input type='password' placeholder='Password' name='password' value={values.password} onChange={handleInput} className='inputBox' />
            {errors.password && <span className='error-label'> {errors.password}</span>}
          </div>
          <div className='formGroup'>
            <label htmlFor='confirmPassword' className='inputLabel'><strong>Confirm Password</strong></label>
            <input type='password' placeholder='Confirm Password' name='confirmPassword' value={values.confirmPassword} onChange={handleInput} className='inputBox' />
            {errors.confirmPassword && <span className='error-label'> {errors.confirmPassword}</span>}
          </div>
          <div className="changeButton">
            <button className="Change-button">Change</button>
          </div>

        </form>
      </div>

    </div>
  )
}

export default ChangePassword