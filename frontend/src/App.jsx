import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const FileUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [asked_question, setAskedQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [file_url, setFileUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileUrl(URL.createObjectURL(e.target.files[0]));
    setResponse("");
  };

  const handleQuestionChange = (e) => {
    if (e && e.target) {
      console.log("From change handler:", e.target.value);
      setQuestion(e.target.value);
    } else {
      console.log("From another function:", e);
      setQuestion(e);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAskedQuestion(question);

    if (!file || !question) {
      setResponse("Please provide both an image and a question.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("question", question);

    setResponse("Waiting for the response...");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/ask/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setResponse("Error: " + data.error);
      } else {
        setResponse(data.answer || "No answer provided.");
      }
    } catch (error) {
      setResponse("An error occurred while sending the request.", error);
    }
  };

  return (
    <div className="hero flex justify-center items-center bg-base-300 min-h-screen">
      <div className="hero-content flex flex-col lg:flex-row items-center lg:items-start">
        <div className="card bg-base-100 max-w-xl shrink-0 shadow-2xl">
          <div className="card-body">
            <fieldset onSubmit={handleSubmit} className="fieldset">
              <label className="fieldset-label">File</label>
              <input
                type="file"
                className="file-input w-full"
                placeholder="Email"
                onChange={handleFileChange}
              />
              <label className="fieldset-label">Question</label>
              <input
                type="input"
                className="input w-full"
                placeholder="Ask?"
                value={question}
                onChange={handleQuestionChange}
              />
              <button
                type="submit"
                className="btn btn-neutral mt-4"
                onClick={handleSubmit}
              >
                Send
              </button>
              <div
                className="card bg-base-100 w-full shadow-sm"
                hidden={!response}
              >
                <div className="card-body">
                  <h1 className="card-title">{asked_question}</h1>
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
      <div
        className="file card w-96 bg-base-100 card-md shadow-sm ml-8"
        hidden={!file}
      >
        <div className="card-body">
          <h2 className="card-title">{file?.name}</h2>
          <figure className="max-w-sm">
            {file_url && <img src={file_url} alt="File" />}
          </figure>
        </div>
      </div>
    </div>
  );
};
export default FileUploadComponent;
