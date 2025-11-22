import React from "react";
import { Mic } from "lucide-react";

export default function FloatingVoiceButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 z-40"
      aria-label="Open Voice Assistant"
    >
      <Mic className="w-8 h-8 text-white" />
    </button>
  );
}
