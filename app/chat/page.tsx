"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Sidebar from "@/app/components/SideBar";
import { Home, Loader2, MessageSquarePlus, Send, Mic, MicOff } from "lucide-react";

export default function ChatIndexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [chats, setChats] = useState<any[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion((prev) => (prev ? prev + " " + transcript : transcript));
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Your browser does not support voice input. Please try Chrome or Edge.");
    }
  };

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Load chats for sidebar
      try {
        setChatsLoading(true);
        const res = await apiRequest("/api/chat/list");
        setChats(res.chats || []);
      } catch (error) {
        console.error("Failed to load chats:", error);
      } finally {
        setChatsLoading(false);
      }

      // If query is present, create a new chat and redirect
      if (q) {
        setCreating(true);
        try {
          const res = await apiRequest("/api/chat/create", { method: "POST" });
          if (res.chat_id) {
            // Redirect to the new chat with the query param preserved
            router.push(`/chat/${res.chat_id}?autoSend=${encodeURIComponent(q)}`);
          }
        } catch (error) {
          console.error("Failed to create chat:", error);
          setCreating(false);
        }
      }
    }
    init();
  }, [q, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setCreating(true);
    try {
      const res = await apiRequest("/api/chat/create", { method: "POST" });
      if (res.chat_id) {
        // Redirect to the new chat with the user's question
        router.push(`/chat/${res.chat_id}?autoSend=${encodeURIComponent(question)}`);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
      setCreating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0b0b] text-white">
      <Sidebar chats={chats} currentChatId={null} setChats={setChats} loading={chatsLoading} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-6">

  <div className="absolute top-4 right-4 py-4 p-9
  " onClick={() => router.push("/")}>
    <Home />
  </div>
        {creating ? (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p>Creating your conversation...</p>
          </div>
        ) : (
          <>
            <div className="p-6 rounded-full bg-white/5 border border-white/10 mb-4">
              <MessageSquarePlus className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">How can I help you today?</h1>
            
            <div className="w-full max-w-2xl mt-8">
                <form onSubmit={handleSubmit} className="relative">
                    <input 
                        type="text" 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask anything about studying abroad..."
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded-2xl py-4 pl-6 pr-12 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xl"
                        autoFocus
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={startListening}
                            className={`p-2 rounded-lg transition-colors ${
                                isListening 
                                    ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse" 
                                    : "bg-white/10 hover:bg-white/20 text-white"
                            }`}
                            title="Voice Input"
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        <button 
                            type="submit"
                            disabled={!question.trim() || creating}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </div>

            <div className="flex gap-2 text-sm text-gray-500 mt-4">
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 cursor-pointer transition-colors" onClick={() => setQuestion("Top universities in USA for CS")}>🇺🇸 USA CS Programs</span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 cursor-pointer transition-colors" onClick={() => setQuestion("Cost of living in London")}>🇬🇧 London Living Cost</span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 cursor-pointer transition-colors" onClick={() => setQuestion("Scholarships in Canada")}>🇨🇦 Canada Scholarships</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
