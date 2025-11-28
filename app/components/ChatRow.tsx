"use client";

import { Trash2, Edit, Check, X } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useState } from "react";

interface ChatRowProps {
  chat: { id: string; title: string };
  onClick: () => void;
  refreshChats: () => void;
}

export default function ChatRow({ chat, onClick, refreshChats }: ChatRowProps) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);

  const deleteChat = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      await apiRequest(`/api/chat/delete/${chat.id}`, { method: "DELETE" });
      refreshChats();
    }
  };

  const saveTitle = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!newTitle.trim()) return;

    await apiRequest(`/api/chat/rename/${chat.id}`, {
      method: "POST",
      body: JSON.stringify({ new_title: newTitle }),
    });

    setEditing(false);
    refreshChats();
  };

  const cancelEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNewTitle(chat.title);
    setEditing(false);
  };

  return (
    <div
      onClick={!editing ? onClick : undefined}
      className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer text-sm text-gray-300 transition-colors"
    >
      {/* Left Side */}
      <div className="flex-1 truncate">
        {editing ? (
          <input
            className="w-full bg-transparent border border-white/10 p-1 rounded-md text-gray-100 text-sm outline-none"
            value={newTitle}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") cancelEdit();
            }}
          />
        ) : (
          <span>{chat.title || "New Chat"}</span>
        )}
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-2 ml-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
        {!editing ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              className="p-1 hover:text-blue-400 transition-colors"
            >
              <Edit size={14} />
            </button>

            <button
              onClick={deleteChat}
              className="p-1 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={saveTitle}
              className="p-1 hover:text-green-400 transition-colors"
            >
              <Check size={16} />
            </button>

            <button
              onClick={cancelEdit}
              className="p-1 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
