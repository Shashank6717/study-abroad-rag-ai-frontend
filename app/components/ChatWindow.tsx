import ChatMessage from "./ChatMessage";
import { Loader2 } from "lucide-react";
import ShinyText from "../../components/ShinyText"

interface ChatWindowProps {
  messages: { role: string; content: string; animate?: boolean }[];
  loading: boolean;
}

import { useEffect, useRef } from "react";

export default function ChatWindow({ messages, loading }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
                <p>Start a conversation...</p>
            </div>
        )}
        
        {messages.map((msg: any, index) => (
          <ChatMessage
            key={index}
            role={msg.role as "assistant" | "user"}
            content={msg.content}
            animate={msg.animate}
          />
        ))}
        
        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 max-w-max animate-pulse">
            <Loader2 className="animate-spin w-4 h-4 text-primary" />
           <ShinyText 
  text="Thinking..." 
  disabled={false} 
  speed={3} 
  className='custom-class' 
/>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" /> {/* Spacer for bottom scrolling */}
      </div>
    </div>
  );
}
