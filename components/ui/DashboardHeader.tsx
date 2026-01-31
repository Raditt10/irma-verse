"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, Settings, User as UserIcon, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "@/components/ui/SearchBar";

export default function DashboardHeader() {
  const router = useRouter();
  
  // Hook ini otomatis akan me-render ulang komponen jika session di-update dari file lain
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/auth";
    }
  });

  const defaultAvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah";
  
  // Pastikan properti ini (avatar) sama dengan yang di-update di ProfileInformationForm
  const userAvatar = session?.user?.avatar || defaultAvatarUrl;
  const userName = session?.user?.name || session?.user?.email || "User";
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between gap-4 h-16">
        
        {/* Logo - Left */}
        <div className="flex items-center gap-3 shrink-0 pl-6 lg:pl-8">
          {/* Mobile burger button */}
          <button
            className="lg:hidden mr-1 inline-flex items-center justify-center h-10 w-10 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => window.dispatchEvent(new Event('open-mobile-sidebar'))}
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <img src="/logo.png" alt="IRMA Verse" className="h-10 w-10 object-contain" />
          
          <div className="block">
            <h2 className="text-base sm:text-lg font-bold text-emerald-600">
              IRMA VERSE
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500">Platform Digital Irma 13</p>
          </div>
        </div>

        {/* Search Bar - Center on desktop */}
        <div className="hidden md:flex flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Right Icons & Profile */}
        <div className="flex items-center gap-4 shrink-0 pr-6 lg:pr-8">
          
          {/* Notification Bell */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5 text-slate-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 h-10 px-2 rounded-lg hover:bg-green-100 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/20">
                <Avatar className="h-8 w-8 border border-slate-200">
                  {/* Bagian ini akan berubah otomatis saat update() dipanggil di Form */}
                  <AvatarImage src={userAvatar} alt={userName} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-xs font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-semibold text-slate-900 truncate max-w-[150px]">
                  {userName}
                </span>
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 mt-2" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-100">
                    <AvatarImage src={userAvatar} alt={userName} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-900 truncate">{userName}</span>
                    <span className="text-xs text-slate-500 truncate">{session?.user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <div className="h-px bg-slate-100 my-1" />
              
              <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer gap-2 py-2.5">
                <UserIcon className="h-4 w-4 text-slate-500" />
                <span>Profile</span> 
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer gap-2 py-2.5">
                <Settings className="h-4 w-4 text-slate-500" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              
              <div className="h-px bg-slate-100 my-1" />
              
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/auth" })}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 gap-2 py-2.5"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar - Below main header */}
      <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-50">
        <SearchBar />
      </div>
    </div>
  );
};