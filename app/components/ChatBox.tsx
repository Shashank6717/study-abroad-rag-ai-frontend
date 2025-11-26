"use client"

import { useState, useTransition } from "react"
import { Send, Loader2 } from "lucide-react"
import ChatMessage from "./ChatMessage"

export default function ChatBox() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    startTransition(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        })

        const data = await res.json()
        setAnswer(data.answer || "No response found.")
      } catch (err) {
        console.error(err)
        setAnswer("⚠️ Error fetching response. Try again.")
      } finally {
        setQuestion("")
      }
    })
  }

  return (
    <div className="w-full max-w-2xl bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6 transition-all duration-300">
      {/* Chat messages */}
      <div className="min-h-[180px] p-4 mb-4 rounded-xl bg-black/30 border border-white/10 overflow-y-auto">
        {isPending ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="animate-spin w-5 h-5 text-blue-400" />
            <span>Thinking...</span>
          </div>
        ) : answer ? (
          <ChatMessage role="assistant" content={answer} />
        ) : (
          <p className="text-gray-500 italic text-center">Your answer will appear here...</p>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question..."
          className="flex-grow px-4 py-3 rounded-xl bg-gray-800/70 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <button
          type="submit"
          disabled={isPending}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white transition-all duration-300 ${
            isPending
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30"
          }`}
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
          {isPending ? "Thinking..." : "Ask"}
        </button>
      </form>
    </div>
  )
}
