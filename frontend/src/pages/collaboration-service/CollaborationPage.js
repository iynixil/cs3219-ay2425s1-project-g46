import { useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import ContentEditor from "../../components/ContentEditor";
import CodeEditor from "../../components/CodeEditor";
import "./styles/CollaborationPage.css";
import { collaborationSocket } from "../../config/socket";
import useSessionStorage from "../../hook/useSessionStorage";

import NavBar from "../../components/NavBar";
import QuestionPanel from "../../components/QuestionPanel";

const CollaborationPage = () => {
  const location = useLocation();
  const [totalCount, setTotalCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(2);

  const data = location.state.data;
  const { id, questionData } = data;
  const [activeTab, setActiveTab] = useState("code", "");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userDisconnected, setUserDisconnected] = useState(false);
  const [unloadFlag, setUnloadFlag] = useSessionStorage("", false);

  window.onload = () => {
    if (unloadFlag) {
      collaborationSocket.emit("userReconnect", { id });
      setUnloadFlag(false);
      collaborationSocket.emit("reloadSession", { id });
    }
    collaborationSocket.emit("receiveCount", { id });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      setIsSubmitted(false);
      collaborationSocket.emit("cancelendSession", { id });
    } else {
      setIsSubmitted(true);
      collaborationSocket.emit("endSession", { id });
    }
  };

  collaborationSocket.on("sessionEnded", () => {
    window.location.href = "/";
  });

  collaborationSocket.on("submissionCount", (count, totalUsers) => {
    setTotalCount(count);
    setTotalUsers(totalUsers);
  });

  collaborationSocket.on("userDisconnect", () => {
    setUserDisconnected(true);
    setTotalCount(0);
    setTotalUsers(1);
  });

  collaborationSocket.on("userReconnect", () => {
    setUserDisconnected(false);
  });

  window.addEventListener("beforeunload", (event) => {
    setUnloadFlag(true);
    collaborationSocket.emit("userDisconnect", { id });
  });

  return (
    <div>
      <NavBar />
      <QuestionPanel questionData={questionData} />
      <div id="tabs">
        <button onClick={() => handleTabChange("code")} autoFocus>
          Code
        </button>
        <button onClick={() => handleTabChange("content")}>Text</button>
        <button id="submitButton" onClick={handleSubmit}>
          {isSubmitted ? "Cancel" : "Submit"}
        </button>
        <span id="submitCount" class="count-badge">
          ({totalCount}/{totalUsers})
        </span>
        {userDisconnected && (
          <span id="disconnection-text">The other user has disconnected.</span>
        )}
      </div>
      <div id="tab-content">
        {/* Render both components with inline styles for visibility control */}
        <div style={{ display: activeTab === "code" ? "block" : "none" }}>
          <CodeEditor id={id} />
        </div>
        <div style={{ display: activeTab === "content" ? "block" : "none" }}>
          <ContentEditor id={id} />
        </div>
      </div>
    </div>
  );
};

export default CollaborationPage;
