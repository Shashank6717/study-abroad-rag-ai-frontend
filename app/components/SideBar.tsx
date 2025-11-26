"use client";

import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import ChatRow from "./ChatRow";
import { MessageSquarePlus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar({ chats, currentChatId, setChats, loading = false }: any) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState("User Account");
  const [username, setUsername] = useState("User Account");
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
        setUserEmail(email);
        setUsername(email.split("@")[0]);
    }
  }, []);

  const createChat = async () => {
    const res = await apiRequest("/api/chat/create", { method: "POST" });
    if (res.chat_id) {
      router.push(`/chat/${res.chat_id}`);
    }
  };

  if (isCollapsed) {
    return (
        <div className="w-16 bg-[#0b0b0b] border-r border-white/5 flex flex-col items-center py-4 space-y-4 transition-all duration-300">
            <button 
                onClick={() => setIsCollapsed(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
                <PanelLeftOpen size={20} />
            </button>
            <button
                onClick={createChat}
                className="p-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-colors"
            >
                <MessageSquarePlus size={20} />
            </button>
        </div>
    )
  }

  return (
    <div className="w-64 bg-[#0b0b0b] flex flex-col border-r border-white/5 transition-all duration-300">
      <div className="p-4 flex items-center justify-between">
        <button
            onClick={createChat}
            className="flex-1 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl transition-all border border-white/5 hover:border-white/10 text-sm font-medium"
        >
            <MessageSquarePlus size={16} />
            <span>New Chat</span>
        </button>
        <button 
            onClick={() => setIsCollapsed(true)}
            className="ml-2 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
            <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-2 custom-scrollbar">
        <div className="px-2 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recent Chats
        </div>
        {loading ? (
            <div className="space-y-2 px-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
                ))}
            </div>
        ) : (
            chats.map((chat: any) => (
            <ChatRow
                key={chat.id}
                chat={chat}
                onClick={() => router.push(`/chat/${chat.id}`)}
                refreshChats={async () => {
                const res = await apiRequest("/api/chat/list");
                setChats(res.chats || []);
                }}
            />
            ))
        )}
      </div>
      
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                {username.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium text-white truncate">{username}</div>
            </div>
        </div>
      </div>
    </div>
  );
}
