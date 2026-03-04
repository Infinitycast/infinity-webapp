"use client";

import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { StudioSidebar } from "@/components/sidebar/StudioSidebar";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import logo from "@/assets/logo.png";
import { User } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface StudioLayoutProps {
  user: User;
  children: React.ReactNode;
}

export function StudioLayout({ user, children }: StudioLayoutProps) {
  if (!user) {
    return null;
  }

  const { state } = useSidebar();

  const collapsed = state === "collapsed";

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen flex  overflow-hidden bg-muted/20 w-full">
        <StudioSidebar user={user} />

        <div className={cn("flex-1 flex flex-col h-screen w-full")}>
          {/* Top Bar */}
          <header className="shrink-0 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
            <div className="flex items-center h-full px-4 gap-4">
              <SidebarTrigger />

              {/* Mobile logo */}
              <div className="md:hidden flex-1 flex justify-center">
                <img
                  src="/assets/logo.png"
                  alt="Infinity Studio"
                  className="h-8 w-auto"
                />
              </div>

              <div className="hidden md:block flex-1" />

              {/* Desktop: Text link */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden md:flex"
              >
                <Link href="/" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Site
                </Link>
              </Button>

              {/* Mobile: Home icon */}
              <Button variant="ghost" size="icon" asChild className="md:hidden">
                <Link href="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
