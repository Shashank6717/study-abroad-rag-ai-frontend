"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Aurora from "@/components/Aurora";

export const Hero = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/chat");
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden ">
        {/* Background Gradients */}
<div className="z-1 w-full">

<Aurora
  colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
  blend={0.5}
  amplitude={1.0}
  speed={0.5}
/>

</div>
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="container px-4 md:px-6 flex flex-col items-center text-center z-10">
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-6 max-w-4xl">
          Your Intelligent Companion for <br />
          <span className="text-primary">Higher Studies Abroad</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Get accurate, source-backed answers about universities, visas, and scholarships. 
          Powered by RAG technology and trusted official documents.
        </p>

        <div className="w-full max-w-2xl relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-background/80 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/10">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                        className="w-full pl-10 h-12 bg-transparent border-none shadow-none focus-visible:ring-0 text-base placeholder:text-muted-foreground/70"
                        placeholder="Ask away..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>
                <Button size="lg" className="font-semibold shadow-lg px-8 rounded-xl ml-2" onClick={handleSearch}>
                    Ask AI <ArrowRight size={18} className="ml-1" />
                </Button>
            </div>
        </div>

        <div className="mt-12 flex gap-4 text-sm text-muted-foreground">
            <p>Trusted by students targeting:</p>
            <div className="flex gap-3 font-medium text-foreground">
                <span>🇺🇸 USA</span>
                <span>🇬🇧 UK</span>
                <span>🇨🇦 Canada</span>
                <span>🇦🇺 Australia</span>
            </div>
        </div>
      </div>
    </section>
  );
};
