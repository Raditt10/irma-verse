"use client";
import { MessageCircle, Sparkles } from "lucide-react";

const ChatbotButton = () => {
  return (
    <div className="fixed bottom-8 right-8 z-40 group">
      {/* Main Button */}
      <button 
        className="relative h-16 w-16 rounded-full bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-600 shadow-[0_8px_32px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.45)] flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95 ring-2 ring-white/40 backdrop-blur-sm overflow-hidden"
        onClick={() => alert('Chatbot dalam pengembangan')}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Avatar Image */}
        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white/30">
          <img 
            src="/ci irma.jpg" 
            alt="Ci Irma" 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
          />
        </div>

        {/* Active Indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:translate-y-0 translate-y-2">
        <div className="relative px-4 py-2.5 bg-slate-900/95 backdrop-blur-sm text-white text-sm font-semibold rounded-xl whitespace-nowrap shadow-lg border border-white/10">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Ngobrol sama Ci Irma</span>
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900/95" />
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400/40 rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '2s' }} />
        <div className="absolute bottom-2 left-1 w-1.5 h-1.5 bg-teal-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
        <div className="absolute top-3 left-2 w-1 h-1 bg-emerald-300/20 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }} />
      </div>
    </div>
  );
};

export default ChatbotButton;