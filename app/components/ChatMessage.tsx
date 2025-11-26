import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
  animate?: boolean;
}

export default function ChatMessage({ role, content, animate = false }: ChatMessageProps) {
  const isAssistant = role === "assistant";
  const [displayedContent, setDisplayedContent] = useState(animate ? "" : content);

  useEffect(() => {
    if (!animate) {
      setDisplayedContent(content);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedContent(content.substring(0, i + 1));
      i++;
      if (i > content.length) {
        clearInterval(interval);
      }
    }, 15); // Optimized speed for natural typing feel

    return () => clearInterval(interval);
  }, [content, animate]);

  return (
    <div
      className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex gap-4 p-4 rounded-xl max-w-[80%] ${
          isAssistant
            ? "bg-white/5 flex-row"
            : "bg-primary/10 flex-row-reverse text-right"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isAssistant
              ? "bg-primary/10 text-primary"
              : "bg-white/10 text-white"
          }`}
        >
          {isAssistant ? <Bot size={18} /> : <User size={18} />}
        </div>

        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="font-medium text-sm text-muted-foreground">
            {isAssistant ? "StudyAbroad AI" : "You"}
          </div>
          <div className={`text-gray-200 leading-relaxed ${!isAssistant ? "text-right" : "text-left"}`}>
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-2xl font-bold mt-6 mb-4 text-white"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-xl font-bold mt-5 mb-3 text-white"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-lg font-semibold mt-4 mb-2 text-white"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 last:mb-0" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="list-disc list-outside ml-6 mb-4 space-y-1"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal list-outside ml-6 mb-4 space-y-1"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                a: ({ node, ...props }) => (
                  <a
                    className="text-primary hover:underline font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-primary/50 pl-4 py-1 my-4 bg-white/5 rounded-r italic text-gray-300"
                    {...props}
                  />
                ),
                code: ({ node, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match && !className?.includes("language-");
                  return isInline ? (
                    <code
                      className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-primary-foreground"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <div className="relative my-4 rounded-lg overflow-hidden bg-[#1e1e1e] border border-white/10 text-left">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                        <span className="text-xs text-gray-400 font-mono">
                          {match?.[1] || "code"}
                        </span>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code
                          className={`text-sm font-mono ${className}`}
                          {...props}
                        >
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6 rounded-lg border border-white/10">
                    <table
                      className="w-full text-left border-collapse"
                      {...props}
                    />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="bg-white/5 p-3 border-b border-white/10 font-semibold text-white"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="p-3 border-b border-white/5 text-gray-300"
                    {...props}
                  />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-6 border-white/10" {...props} />
                ),
              }}
            >
              {displayedContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
