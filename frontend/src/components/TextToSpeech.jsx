import React, { useState } from "react";

const TextToSpeech = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false); // Track if speech is active

  const handleTextToSpeech = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        // Stop speaking if already speaking
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-UK";
        utterance.rate = 1; // Normal speed
        utterance.pitch = 1.5; // Default pitch

        // Event fires when speaking has started
        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        // Event fires when speaking has ended
        utterance.onend = () => {
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Sorry, your browser does not support text-to-speech.");
    }
  };

  return (
    <button
      onClick={handleTextToSpeech}
      className={`btn  btn-speech ${isSpeaking ? "flashing" : "btn-active"}`}
    >
      {isSpeaking ? "Stop Speaking" : "Speak Text"}
    </button>
  );
};

export default TextToSpeech;
