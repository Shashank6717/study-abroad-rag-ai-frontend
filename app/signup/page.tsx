"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail,Home } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res?.token) {
        localStorage.setItem("token", res.token);
        if (res.user?.email) {
            localStorage.setItem("userEmail", res.user.email);
        }
        window.dispatchEvent(new Event("auth-change"));
        router.push("/chat");
      } else {
        setError(res.error || "Signup failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md bg-background/60 backdrop-blur-lg border-white/20 border-2 shadow-2xl">
        <CardHeader className="space-y-1 items-center text-center pb-6">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join us to start your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center font-medium">
                    {error}
                </div>
            )}
            
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                        id="email"
                        type="email" 
                        placeholder="Enter your email" 
                        className="pl-9"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        id="password"
                        type={isVisible ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-9 pr-9"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none" 
                        type="button" 
                        onClick={toggleVisibility}
                    >
                        {isVisible ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            <Button type="submit" className="w-full font-semibold shadow-sm mt-2" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <div className="text-center text-sm">
            Already have an account?&nbsp;
            <Link href="/login" className="font-bold text-primary hover:underline">
              Login
            </Link>
          </div>
          <div className="flex items-center justify-center w-full gap-1 my-1">
            <Link href="/" className="font-bold text-primary hover:underline">
              Back to Home 
            </Link>
              <span>
                <Home height={20} width={20}/>
              </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
