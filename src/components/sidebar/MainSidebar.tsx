"use client";

import Link from "next/link";
import { Heart, Users, LogOut, LayoutDashboard, HomeIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

const navItems = [
  {
    title: "My Subscriptions",
    url: "/#subscriptions",
    icon: Heart,
    authRequired: true,
  },
  {
    title: "Home",
    url: "/home",
    icon: HomeIcon,
    authRequired: false,
  },
];

interface MainSidebarProps {
  user: any;
}

export function MainSidebar({ user }: MainSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const filteredItems = navItems.filter((item) => !item.authRequired || user);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div
          className={`flex items-center gap-3 p-4 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/assets/logo.png"
              alt="InfinityCast"
              width={32}
              height={32}
              className="transition-transform duration-300 group-hover:scale-110 shrink-0"
            />
            {!collapsed && (
              <span className="text-xl font-display tracking-wider">
                INFINITYCAST
              </span>
            )}
          </Link>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 hover:text-foreground transition-colors"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <>
            <Separator className="my-4" />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href="/studio"
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 hover:text-foreground transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>Infinity Studio</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <Separator className="mb-4" />

        {user ? (
          <div
            className={`p-4 ${
              collapsed ? "flex justify-center" : "flex items-center gap-3"
            }`}
          >
            <Avatar className={collapsed ? "h-8 w-8" : "h-10 w-10"}>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
            </Avatar>

            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {user.first_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() =>
                    alert("Sign out functionality not implemented.")
                  }
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={`p-4 ${collapsed ? "flex justify-center" : ""}`}>
            <Button
              asChild
              variant="default"
              className={collapsed ? "w-10 h-10 p-0" : "w-full"}
            >
              <Link href="/auth/signin">
                {collapsed ? <Users className="h-4 w-4" /> : "Login"}
              </Link>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
