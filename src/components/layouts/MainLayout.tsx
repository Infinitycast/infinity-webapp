"use client";

import { useState, type ReactNode } from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  user: any;
  children: ReactNode;
}

export function MainLayout({ user, children }: MainLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <LayoutContent
      user={user}
      searchOpen={searchOpen}
      setSearchOpen={setSearchOpen}
    >
      {children}
    </LayoutContent>
  );
}

// This component is rendered **inside SidebarProvider**
function LayoutContent({ user, searchOpen, setSearchOpen, children }: any) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div className="flex min-h-screen min-w-full overflow-hidden">
      <div
        className={cn(
          "flex-shrink-0 transition-all duration-200",
          collapsed ? "w-[3rem]" : "w-0 md:w-64"
        )}
      >
        <MainSidebar user={user} />
      </div>

      <div className="flex flex-1 flex-col min-w-0 transition-all duration-200">
        <header className="shrink-0 z-50 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-4 gap-4">
          {!collapsed && <SidebarTrigger />}

          <div className="md:hidden flex-1 flex justify-center">
            <img
              src="/assets/logo.png"
              alt="InfinityCast"
              width={32}
              height={32}
            />
          </div>

          <div className="hidden md:block flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shows, episodes, creators..."
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
          </div>

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </header>

        {/* Mobile search dialog */}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="sm:max-w-md bg-background border-border">
            <DialogTitle className="sr-only">Search</DialogTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search shows, episodes, creators..."
                className="pl-12 pr-4 h-12 text-lg bg-muted/50 border-border/50"
                autoFocus
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
