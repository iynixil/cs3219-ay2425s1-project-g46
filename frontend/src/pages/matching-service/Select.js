import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./utils/socket";
import "./styles/Select.css";

// Use the correct URL for the Socket.IO connection
// const socket = io.connect("http://localhost:5002");


function Select() {
  const naviagte = useNavigate();

  const [errorMessage, setErrorMessage] = useState({
    topic: '',
    difficultyLevel: ''
  });

  const [formData, setFormData] = useState({
    topic: '',
    difficultyLevel: '',
    email: '',
    token: '',
  });

  const difficultyLevelOptions = [
    {label: "Easy", value: "easy"},
    {label: "Medium", value: "medium"},
    {label: "Hard", value: "hard"}
  ];

  const topicOptions = [
    {label: "Databases", value: "Databases"},
    {label: "Algorithms", value: "Algorithms"},
    {label: "Data Structures", value: "Data Structures"}
  ];

  const handleInput = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

//   useEffect(() => {
//     socket.on("connect", () => {
//         console.log(`Connected with socket ID: ${socket.id}`);
//     });

//     socket.emit("send_message", { message: "Hello from client" });

//     return () => {
//         socket.disconnect();
//     };
// }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log(`${formData.topic}, ${formData.difficultyLevel}`);
    
    let newErrorMessage = {};

    if (formData.topic === "") {
      newErrorMessage.topic = "Please select a topic";
    } else {
      delete newErrorMessage.topic;
    }

    if (formData.difficultyLevel === "") {
      newErrorMessage.difficultyLevel = "Please select a difficulty level";
    } else {
      delete newErrorMessage.difficultyLevel;
    }

    setErrorMessage(newErrorMessage);

    if (Object.keys(newErrorMessage).length === 0) {
      const updatedFormData = {
        ...formData,
        email: sessionStorage.getItem("email"),
        token: sessionStorage.getItem("token"),
      };

      // Emit a message to the server when submitting
      socket.emit("join_matching_queue", updatedFormData);

      naviagte(`/matching/findingmatch`);
    }
  };

  return (
    <div>
      <h1>Selection</h1>
      <form onSubmit={handleSubmit}>
        <div className='formGroup'>
          <label htmlFor='topic'><strong>Topic</strong></label>
          <select name='topic' value={formData.topic} onChange={handleInput} className="dropdown">
            <option value="">Select Topic</option>
            {topicOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errorMessage.topic && <span className='errorLabel'>{errorMessage.topic}</span>}
        </div>

        <div className='formGroup'>
          <label htmlFor='difficultyLevel'><strong>Difficulty Level</strong></label>
          <select name="difficultyLevel" value={formData.difficultyLevel} onChange={handleInput} className="dropdown">
            <option value="">Select Difficulty Level</option>
            {difficultyLevelOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errorMessage.difficultyLevel && <span className='errorLabel'>{errorMessage.difficultyLevel}</span>}
        </div>

        <button type="submit">Find match</button>
      </form>
    </div>
  );
}

export default Select;
