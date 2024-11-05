import React, { useState, useEffect } from "react";
import { collaborationSocket } from "../config/socket";
import "./styles/ChatBox.css";
import useSessionStorage from "../hook/useSessionStorage";

const ChatBox = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const openForm = () => {
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (message.trim() !== "") { 
        console.log("emitting");
        // const temp = `${id}: ${message}`
        collaborationSocket.emit("sendMessage", { message });
        setMessage(""); 
    }
    console.log("Message sent:", message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage("");
    // closeForm();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Allow Shift + Enter for new line
        e.preventDefault();
        handleSubmit(e);
    }
  };
  

  useEffect(() => {
    console.log("recieved msg");
    collaborationSocket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
        collaborationSocket.off("receiveMessage");
        };
    }, [messages]);

  return (
    <div>
      <button className="open-button" onClick={openForm}>
        Chat
      </button>
      

      {isOpen && (
        <div className="chat-popup" id="myForm">
          <form action="/action_page.php" className="form-container" onSubmit={handleSubmit}>
            <h1>Chat</h1>
            <div className="messages">
                {/* Display all messages */}
                {messages.map((msg, index) => (
                <div key={index} className="message">{msg}</div>
                ))}
            </div>
            {/* <label htmlFor="msg"><b>Message</b></label> */}
            <textarea
              placeholder="Type message.."
              name="msg"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            ></textarea>
            <button type="submit" className="btn">Send</button>
            <button type="button" className="btn cancel" onClick={closeForm}>
              Close
            </button>
          </form>
          
        </div>
      )}
    </div>
  );
};

export default ChatBox;
