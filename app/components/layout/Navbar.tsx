"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 max-w-screen-2xl">

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <span className="font-semibold text-xl tracking-tight">
            StudyAbroad<span className="text-primary font-bold">AI</span>
          </span>
        </Link>

        {/* Desktop Chats */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center">
            <Link href="/chat">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-lg hover:bg-accent/40 ${
                  pathname.startsWith("/chat") ? "text-primary font-semibold" : ""
                }`}
              >
                Chats
              </Button>
            </Link>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Mobile Chats (visible only on phones) */}
          {isLoggedIn && (
            <div className="flex md:hidden items-center">
              <Link href="/chat">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-lg hover:bg-accent/40 ${
                    pathname.startsWith("/chat") ? "text-primary font-semibold" : ""
                  }`}
                >
                  Chats
                </Button>
              </Link>
            </div>
          )}

          {/* Login / Logout */}
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg hover:bg-accent/40"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-lg font-semibold">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
};
