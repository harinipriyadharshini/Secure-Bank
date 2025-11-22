import React, { useState, useEffect } from "react";
import { Mic, X, Volume2, Key } from "lucide-react";

export default function VoiceAssistant({ show, onClose, onNavigate, userId }) {
  const [isListening, setIsListening] = useState(false);
  const [answer, setAnswer] = useState("How can I help you today?");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingMessage, setPendingMessage] = useState(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;

  recognition.onstart = () => setIsListening(true);
  recognition.onend = () => setIsListening(false);

  useEffect(() => {
    if (show) {
      setAnswer("How can I help you today?");
      setShowPasswordPrompt(false);
      setPassword("");
      setPendingAction(null);
      setPendingMessage(null);
    }
  }, [show]);

  const startListening = (callback) => {
    recognition.start();
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      callback(text);
    };
  };

  const sendToBackend = async (text, pwd = null) => {
    try {
      const res = await fetch("http://localhost:8000/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          message: text,
          password: pwd,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Backend error:", res.status, errorData);
        setAnswer(`Error: ${errorData.detail || "Backend error. Please try again."}`);
        return;
      }

      const data = await res.json();

      // Speak the reply
      speak(data.reply);
      setAnswer(data.reply);

      // Handle page navigation
      if (data.page) {
        onNavigate(data.page);
      }

      // Handle password requirement for money transfers
      if (data.data?.require_password) {
        setPendingAction({ text });
        setPendingMessage(data);
        setShowPasswordPrompt(true);
      } else {
        setShowPasswordPrompt(false);
        setPendingAction(null);
        setPendingMessage(null);
        
        // Auto-close after successful transaction or balance check
        if (data.data?.success || (data.page && data.page !== "statements")) {
          setTimeout(() => onClose(), 2000);
        }
      }
    } catch (error) {
      console.error("Connection error:", error);
      setAnswer("Connection error. Please try again.");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (pendingAction && password) {
      sendToBackend(pendingAction.text, password);
      setPassword("");
    }
  };

  const speak = (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 0.9;
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
          <p className="text-gray-600 mb-6 min-h-[48px] text-sm leading-relaxed">{answer}</p>

          {showPasswordPrompt ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 my-4">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!password}
                className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Transaction
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPendingAction(null);
                  setPassword("");
                  setAnswer("Transaction cancelled.");
                }}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              {/* Voice Animation */}
              <div className="mb-8 h-16 flex justify-center items-center">
                {isListening ? (
                  <div className="flex justify-center items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-8 bg-teal-500 rounded-full animate-pulse"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          height: `${
                            [8, 12, 16, 12, 8][i] * 2
                          }px`,
                        }}
                      ></div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">
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
            </>
          )}

          {/* Quick Actions */}
          <div className="mt-8 space-y-2">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Try saying:
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => sendToBackend("Check my account balance")}
                className="w-full bg-teal-50 text-teal-700 py-2 px-4 rounded-lg hover:bg-teal-100 transition text-sm font-medium"
              >
                "Check my balance"
              </button>
              <button 
                onClick={() => sendToBackend("Show me my recent transactions")}
                className="w-full bg-teal-50 text-teal-700 py-2 px-4 rounded-lg hover:bg-teal-100 transition text-sm font-medium"
              >
                "Show recent transactions"
              </button>
              <button 
                onClick={() => sendToBackend("Send 500 to Ravi")}
                className="w-full bg-teal-50 text-teal-700 py-2 px-4 rounded-lg hover:bg-teal-100 transition text-sm font-medium"
              >
                "Send money to someone"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
