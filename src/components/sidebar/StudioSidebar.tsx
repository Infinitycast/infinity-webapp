"use client";

import {
  Home,
  Tv,
  BarChart3,
  Upload,
  Settings,
  LogOut,
  Star,
  HelpCircle,
  CalendarDays,
  FileText,
} from "lucide-react";

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
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const TwitchIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

const items = [
  { title: "Dashboard", url: "/studio", icon: Home },
  { title: "My Shows", url: "/studio/shows", icon: Tv },
  { title: "Articles", url: "/studio/articles", icon: FileText },
  { title: "Planner", url: "/studio/planner", icon: CalendarDays },
  { title: "Analytics", url: "/studio/analytics", icon: BarChart3 },
  { title: "Originals", url: "/studio/originals", icon: Star },
  { title: "Twitch", url: "/studio/twitch", icon: TwitchIcon },
  { title: "Create Show", url: "/create-show", icon: Upload },
  { title: "Help Hub", url: "/help", icon: HelpCircle },
  { title: "Settings", url: "/studio/settings", icon: Settings },
];

export function StudioSidebar(props: any) {
  const { user } = props;

  const { state } = useSidebar();

  const currentPath = usePathname();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader>
        <div
          className={`flex items-center gap-3 px-4 py-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Link href="/" className="group inline-flex items-center">
            {collapsed ? (
              <div className="relative flex items-center justify-center w-8 h-8">
                <img
                  src="/assets/logo.png"
                  alt="InfinityCast"
                  width={32}
                  height={32}
                  className="absolute inset-0 my-auto transition-all duration-150 opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-90"
                />
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-150 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100">
                  <SidebarTrigger />
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </Link>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "hover:bg-muted/50 hover:text-foreground active:bg-primary/10 active:text-primary active:font-medium active:border-primary",
                        {
                          "bg-primary text-black": currentPath === item.url,
                        }
                      )}
                    >
                      <item.icon
                        className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`}
                      />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator className="mb-4" />
        {user && (
          <div
            className={`p-4 ${
              collapsed ? "flex justify-center" : "flex items-center gap-3"
            }`}
          >
            {collapsed ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </button>
              </>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
