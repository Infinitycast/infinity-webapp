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
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "My Subscriptions",
    url: "/#subscriptions",
    icon: Heart,
    authRequired: true,
  },
  {
    title: "Home",
    url: "/",
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

  const currentPath = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarRail />
      <SidebarHeader>
        <div
          className={`flex items-center gap-3 px-4 py-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? (
            <div className="flex items-center justify-center w-8 h-8">
              <img
                src="/assets/logo.png"
                alt="InfinityCast"
                className="w-6 h-6 shrink-0 object-contain"
              />
            </div>
          ) : (
            <>
              <Link href="/" className="inline-flex items-center">
                <img
                  src="/assets/logo.png"
                  alt="InfinityCast"
                  width={32}
                  height={32}
                  className="shrink-0"
                />
                <span className="ml-3 text-xl font-display tracking-wider">
                  INFINITYCAST
                </span>
              </Link>

              <div className="ms-auto block sm:hidden">
                <SidebarTrigger isClose={true} />
              </div>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 hover:text-foreground transition-colors",
                        {
                          "bg-primary text-black": currentPath === item.url,
                        }
                      )}
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

      <SidebarFooter className="p-0">
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
                  onClick={async () => {
                    await fetch("/api/logout", { method: "POST" });
                    window.location.href = "/";
                  }}
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
