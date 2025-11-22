import React, { useState } from "react";
import { Mic, X, Volume2 } from "lucide-react";

export default function VoiceAssistant({ show, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [answer, setAnswer] = useState("");
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  const startListening = (callback) => {
    recognition.start();
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      callback(text);
    };
  };

  const sendToBackend = async (text) => {
    const res = await fetch("http://localhost:8000/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        message: text,
      }),
    });

    const data = await res.json();

    speak(data.reply); // voice reply
    setAnswer(data.reply); // show on screen
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    window.speechSynthesis.speak(speech);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative border-4 border-teal-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full mx-auto flex items-center justify-center shadow-xl">
              <Volume2 className="w-12 h-12 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Voice Assistant
          </h2>
          <p className="text-gray-600 mb-6">{answer}</p>

          {/* Voice Animation */}
          <div className="mb-8">
            {isListening ? (
              <div className="flex justify-center items-center gap-2">
                <div
                  className="w-2 h-8 bg-teal-500 rounded-full animate-pulse"
                ></div>
                <div
                  className="w-2 h-12 bg-teal-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-16 bg-teal-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-12 bg-teal-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div
                  className="w-2 h-8 bg-teal-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Click the microphone to start
              </p>
            )}
          </div>

          {/* Microphone Button */}
          <button
            onClick={() => startListening(sendToBackend)}
            disabled={isListening}
            className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-xl transition-all ${
              isListening
                ? "bg-red-500 hover:bg-red-600 scale-110"
                : "bg-gradient-to-br from-teal-500 to-cyan-500 hover:scale-105"
            }`}
          >
            <Mic className="w-10 h-10 text-white" />
          </button>

          <p className="text-sm text-gray-600 mt-4">
            {isListening ? "Listening..." : "Tap to speak"}
          </p>

          {/* Quick Actions */}
          <div className="mt-8 space-y-2">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Try saying:
            </p>
            <div className="space-y-2">
              <button className="w-full bg-teal-50 text-teal-700 py-2 px-4 rounded-lg hover:bg-teal-100 transition text-sm">
                "Check my account balance"
              </button>
              <button className="w-full bg-teal-50 text-teal-700 py-2 px-4 rounded-lg hover:bg-teal-100 transition text-sm">
                "Show recent transactions"
              </button>
              <button className="w-full bg-teal-50 text-teal-700 py-2 px-4 rounded-lg hover:bg-teal-100 transition text-sm">
                "Transfer money"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
