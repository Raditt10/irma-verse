"use client";
import { MessageCircle } from "lucide-react";

const ChatbotButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <button 
        className="relative h-14 w-14 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 overflow-hidden border-2 border-emerald-600"
        onClick={() => alert('Chatbot dalam pengembangan')}
      >
        <img 
          src="/ci irma.jpg" 
          alt="Ci Irma" 
          className="h-full w-full object-cover" 
        />
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
          Chat dengan Ci Irma
        </div>
      </div>
    </div>
  );
};

export default ChatbotButton;