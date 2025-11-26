"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Sidebar from "@/app/components/SideBar";
import ChatWindow from "@/app/components/ChatWindow";
import { Loader2, Send, Mic, MicOff } from "lucide-react";
import { Home } from "lucide-react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoSend = searchParams.get("autoSend");
  const hasAutoSent = useRef(false);
  const [isListening, setIsListening] = useState(false);

  // Handle chatId properly - it could be string, string[], or undefined
  const chatId = Array.isArray(params.chatId)
    ? params.chatId[0]
    : params.chatId;

  const [chats, setChats] = useState<any[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string; animate?: boolean }>
  >([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Load chat list
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadChats() {
      try {
        setChatsLoading(true);
        const res = await apiRequest("/api/chat/list");
        setChats(res.chats || []);
      } catch (error) {
        console.error("Failed to load chats:", error);
      } finally {
        setChatsLoading(false);
      }
    }
    loadChats();
  }, [router]);

  // Load messages
  useEffect(() => {
    if (!chatId) return; // Guard clause

    async function loadMsgs() {
      try {
        const res = await apiRequest(`/api/chat/messages/${chatId}`);
        if (res.error) {
          console.error("Error loading messages:", res.error);
          setMessages([]);
          return;
        }
        // Ensure messages are in the correct format
        const formattedMessages = (res.messages || []).map((msg: any) => ({
          role: msg.role || "assistant",
          content: msg.content || "",
        }));
        setMessages(formattedMessages);
      } catch (error: any) {
        console.error("Failed to load messages:", error);
        setMessages([]);
      }
    }
    loadMsgs();
  }, [chatId]);

  // Handle autoSend
  useEffect(() => {
    if (autoSend && chatId && !hasAutoSent.current && messages.length === 0) {
        hasAutoSent.current = true;
        sendMessage(autoSend);
        // Clear the query param to prevent re-sending on refresh
        router.replace(`/chat/${chatId}`);
    }
  }, [autoSend, chatId, messages.length, router]);

  // Send message to backend
  const sendMessage = async (overrideQuestion?: string) => {
    const textToSend = overrideQuestion || question;
    if (!textToSend || !chatId) return;

    setLoading(true);
    setQuestion(""); // Clear input immediately

    try {
      // Optimistic update
      setMessages((prev) => [
        ...prev,
        { role: "user", content: textToSend },
      ]);

      const res = await apiRequest("/api/chat/querywithrag", {
        method: "POST",
        body: JSON.stringify({
          chat_id: chatId,
          question: textToSend,
        }),
      });

      if (res.error) {
        console.error("Backend error:", res.error);
        alert(`Error: ${res.error}`);
        if (!overrideQuestion) setQuestion(textToSend); // Restore question on error
        return;
      }

      // Reload messages from database to ensure consistency
      const messagesRes = await apiRequest(`/api/chat/messages/${chatId}`);
      if (messagesRes.messages) {
        setMessages(messagesRes.messages);
      } else {
        // Fallback: add to local state if reload fails
        setMessages((prev) => [
            ...prev, 
             { role: "assistant", content: res.answer, animate: true },
        ]);
      }

      // Refresh chat list to update titles (especially for new chats)
      const chatListRes = await apiRequest("/api/chat/list");
      if (chatListRes.chats) {
        setChats(chatListRes.chats);
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      alert(`Failed to send message: ${error.message || "Unknown error"}`);
      if (!overrideQuestion) setQuestion(textToSend); // Restore question on error
    } finally {
      setLoading(false);
    }
  };

  // Show loading state if chatId is not available
  if (!chatId) {
    return (
      <div className="flex h-screen bg-[#0b0b0b] text-white items-center justify-center">
        <div>Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0b0b0b] text-white">
      {/* Left Sidebar */}
      <Sidebar chats={chats} currentChatId={chatId} setChats={setChats} loading={chatsLoading} />

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-transparent relative">
        <div className="absolute top-4 right-4 z-10">
            <button 
                onClick={() => router.push("/")}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Back to Home"
            >
                <Home size={20} />
            </button>
        </div>
        <ChatWindow messages={messages} loading={loading} />

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b] to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl flex items-end gap-2 shadow-2xl p-2 transition-colors focus-within:border-white/20 focus-within:bg-[#252525]">
              <textarea
                className="flex-1 bg-transparent outline-none px-4 py-3 text-white placeholder-gray-500 resize-none max-h-32 min-h-[52px]"
                placeholder="Ask a follow-up question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
              />

              <button
                onClick={startListening}
                className={`p-3 rounded-xl transition-all mb-0.5 ${
                  isListening 
                    ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse" 
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Voice Input"
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={() => sendMessage()}
                disabled={loading || !question.trim()}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-0.5"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={20} />}
              </button>
            </div>
            <div className="text-center mt-2">
                <p className="text-xs text-gray-500">AI can make mistakes. Check important info.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
