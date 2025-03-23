import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeechToText = ({ on_change }) => {
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript.trim() !== "") {
      on_change(transcript, true);
    }
  }, [transcript, on_change]);

  useEffect(() => {
    if (!listening) {
      resetTranscript();
    }
  }, [listening, resetTranscript]);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <div>
      <div className="flex justify-center">
        <button
          className={`btn btn-circle btn-active btn-speech ${
            listening ? "flashing btn-lg m-0" : "m-1"
          }`}
          onClick={listening ? SpeechRecognition.stopListening : startListening}
        >
          🎤
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;
