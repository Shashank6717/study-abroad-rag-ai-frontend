"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { BookOpen, Globe, ShieldCheck, Sparkles } from "lucide-react";
import BlurText from "../../../components/BlurText"
export const Features = () => {
  const features = [
    {
      title: "Official Sources Only",
      description: "Answers are derived strictly from official government websites and university portals. No hallucinations.",
      icon: <ShieldCheck size={40} className="text-primary" />,
    },
    {
      title: "Multi-Country Support",
      description: "Comprehensive data for USA, UK, Canada, Australia, and more popular study destinations.",
      icon: <Globe size={40} className="text-blue-500" />,
    },
    {
      title: "RAG Powered",
      description: "Retrieval-Augmented Generation ensures your questions are answered with the latest available data.",
      icon: <Sparkles size={40} className="text-yellow-500" />,
    },
    {
      title: "Document Analysis",
      description: "Upload your offer letters or visa documents for instant analysis and explanation.",
      icon: <BookOpen size={40} className="text-green-500" />,
    },
  ];

  const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

return (
    <section className="py-20 relative overflow-hidden bg-black">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold text-white">
       <BlurText
  text="Why use this Assistant?"
  delay={150}
  animateBy="words"
  direction="top"
  animationFrom={{
    opacity: 0,
    filter: "blur(10px)",
    y: -10,
  }}
  animationTo={{
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
  }}
  onAnimationComplete={handleAnimationComplete}
  className="text-5xl justify-center"
/>

          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
            Navigating higher studies can be overwhelming. We make it simple, accurate, and reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
            >
              {/* Glossy shine effect that follows mouse */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)'
                }}
              />
              
              <Card className="relative border border-white/10 bg-gradient-to-b from-zinc-900 to-black overflow-hidden group-hover:border-white/20 transition-all duration-300">
                {/* Top glossy highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <CardHeader className="pb-2 pt-6 px-6 flex-col items-start space-y-4 relative">
                  <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 group-hover:bg-white/10 group-hover:scale-105 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-xl text-white">
                    {feature.title}
                  </h4>
                </CardHeader>
                <CardContent className="px-6 pb-6 relative">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
                
                {/* Bottom shadow for depth */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}