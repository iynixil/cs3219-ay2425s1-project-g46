// Author(s): Xue ling, Calista
import "./styles/CodeEditor.css";
import { useEffect, useRef, useState } from "react";
import { collaborationSocket } from "../config/socket";
import Editor from "@monaco-editor/react";
import supportedLanguages from "../data/supportedLanguages.json";
import useSessionStorage from "../hook/useSessionStorage";
import axios from "axios";
import OutputWindow from "./OutputWindow";

const CodeEditor = ({ id }) => {
  const [code, setCode] = useSessionStorage("", "code");
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    console.log(id);

    // emit once for default values
    collaborationSocket.emit("sendCode", { id, code });
    collaborationSocket.emit("languageChange", { id, language });
  }, [id]);

  useEffect(() => {
    console.log(id);

    collaborationSocket.on("receiveCode", ({ code }) => {
      setCode(code);
      console.log("code received: ", code);

    });

    collaborationSocket.on("languageChange", ({ language }) => {
      setLanguage(language);
    });

    return () => {
      collaborationSocket.off("receiveCode");
      collaborationSocket.off("languageChange");
    };
  }, [id, language, code]);


  collaborationSocket.on("sessionEnded", (socketId) => {
    setCode("");
  });


  function handleEditorChange(code, event) {
    setCode(code);
    collaborationSocket.emit("sendCode", { id, code });
  }

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setLanguage(language);
    collaborationSocket.emit("languageChange", { id, language });
  };

  const handleSubmit = async () => {
    const selectedLanguage = supportedLanguages.find(
      (lang) => lang.value === language
    );
    const languageId = selectedLanguage.language_id;

    console.log(code);
    console.log(languageId);
    try {
      // Step 1: Submit code to backend
      const response = await axios.post(
        `${process.env.REACT_APP_COLLABORATION_SOCKET_URL}/collaboration/submitCode`,
        {
          code,
          languageId,
        }
      );

      console.log(response.data);
      const { submissionId } = response.data;
      console.log("Submission ID:", submissionId);

      // Step 2: Poll for result
      const pollForResult = async (submissionId) => {
        try {
          const resultResponse = await axios.get(
            `${process.env.REACT_APP_COLLABORATION_SOCKET_URL}/collaboration/getSubmissionResult/${submissionId}`
          );
          const result = resultResponse.data;

          // Check if the submission is still processing
          if (result.status?.id === 1 || result.status?.id === 2) {
            console.log("Still processing...");
            setTimeout(() => pollForResult(submissionId), 2000);
          } else {
            // Processed - handle the successful result
            setProcessing(false);
            setOutputDetails(resultResponse.data);
            console.log("Final submission result:", result);
          }
        } catch (err) {
          console.error("Error fetching submission result:", err);
          setProcessing(false);
        }
      };

      // Start polling for result
      pollForResult(submissionId);
    } catch (error) {
      console.error("Error submitting code:", error);
      setProcessing(false);
    }
  };

  return (
    <div id="editor-container" className="container">
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="">--Please choose a language--</option>
        {supportedLanguages.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Editor
        height="50vh"
        language={language}
        defaultValue={"// your code here"}
        value={code}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          minimap: {
            enabled: true,
            renderCharacters: true, // Show characters in the minimap
          },
        }}
      />
      <button id="codeButton" onClick={handleSubmit}>
        Code Execution
      </button>
      <OutputWindow id="outputWindow" outputDetails={outputDetails} />
    </div>
  );
};

export default CodeEditor;
