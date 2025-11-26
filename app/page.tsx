import { Navbar } from "@/app/components/layout/Navbar";
import { Hero } from "@/app/components/home/Hero";
import { Features } from "@/app/components/home/Features";
import RotatingText from "../components/RotatingText"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      
      <footer className="py-10 text-center text-default-400 text-sm border-t border-default-100">
        
        <p>© 2025 StudyAbroadAI. Built with RAG & ❤️.</p>
      </footer>
    </main>
  );
}
