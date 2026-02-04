"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutGrid,
  BookOpen,
  Calendar,
  Users,
  GraduationCap,
  Trophy,
  Newspaper,
  Menu,
  PanelLeftClose,
  X,
  MessageCircle,
  HelpCircle,
  BookMarked,
  MessageSquare,
  Award,
  ChevronDown,
} from "lucide-react";

// Custom scrollbar styles
const scrollbarStyles = `
  .sidebar-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .sidebar-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .sidebar-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #14b8a6 0%, #06b6d4 100%);
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #0d9488 0%, #0891b2 100%);
    background-clip: padding-box;
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
  }
  
  .sidebar-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #14b8a6 transparent;
  }

  .mobile-sidebar-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .mobile-sidebar-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .mobile-sidebar-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #14b8a6 0%, #06b6d4 100%);
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  }
  
  .mobile-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #0d9488 0%, #0891b2 100%);
    background-clip: padding-box;
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
  }

  .mobile-sidebar-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #14b8a6 transparent;
  }
`;

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [expandedSubmenus, setExpandedSubmenus] = useState<{ [key: string]: boolean }>({});

  // Ambil role user untuk pengecekan logic
  const role = session?.user?.role;
  const isInstruktur = role === "instruktur";

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-expanded');
    if (saved !== null) {
      setIsExpanded(JSON.parse(saved));
    } else {
      // Default: collapse on mobile, expand on desktop
      const isMobile = window.innerWidth < 1024;
      setIsExpanded(!isMobile);
    }
    setMounted(true);
  }, []);

  // Persist sidebar state to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebar-expanded', JSON.stringify(isExpanded));
    }
  }, [isExpanded, mounted]);

  // Listen for global events to open/close mobile sidebar
  useEffect(() => {
    const openHandler = () => setIsMobileOpen(true);
    const closeHandler = () => setIsMobileOpen(false);
    window.addEventListener('open-mobile-sidebar', openHandler as EventListener);
    window.addEventListener('close-mobile-sidebar', closeHandler as EventListener);
    return () => {
      window.removeEventListener('open-mobile-sidebar', openHandler as EventListener);
      window.removeEventListener('close-mobile-sidebar', closeHandler as EventListener);
    };
  }, []);

  // --- LOGIC MENENTUKAN PATH DASHBOARD ---
  const getDashboardPath = () => {
    if (role === "instruktur") return "/academy";
    if (role === "admin") return "/admin";
    return "/overview"; // 
  };

  // Handle submenu toggle
  const toggleSubmenu = (id: string) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // --- MENU ITEMS ---
  const baseMenuItems = [
    { 
      icon: LayoutGrid, 
      label: "Dashboard", 
      path: getDashboardPath()
    },
    { 
      icon: BookOpen, 
      label: isInstruktur ? "Kelola Kajian" : "Kajian Mingguanku", 
      path: isInstruktur ? "/materials" : undefined,
      id: "kajian",
      submenu: !isInstruktur ? [
        {
          icon: Calendar,
          label: "Jadwal Kajian",
          path: "/materials"
        },
        {
          icon: BookMarked,
          label: "Rekapan Materi",
          path: "/materials/rekapan"
        },
        {
          icon: HelpCircle,
          label: "Kuis",
          path: "/quiz"
        }
      ] : undefined
    },
  ];

  const menuItems = [
    ...baseMenuItems,
    ...(!isInstruktur ? [
      { 
        icon: MessageSquare, 
        label: "Forum Diskusi", 
        path: "/chat-rooms" 
      }
    ] : []),
    { 
      icon: Award, 
      label: "Peringkat", 
      path: "/leaderboard" 
    },
    { 
      icon: Calendar, 
      label: "Event", 
      path: "/schedule" 
    },
    { 
      icon: Users, 
      label: "Daftar Instruktur", 
      path: "/instructors" 
    },
    { 
      icon: MessageCircle, 
      label: isInstruktur ? "Chat Anggota" : "Chat Instruktur", 
      path: isInstruktur ? "/academy/chat" : "/instructors/chat" 
    },
    { 
      icon: GraduationCap, 
      label: "Program Kurikulum", 
      path: "/programs" 
    },
    { 
      icon: Trophy, 
      label: "Info Perlombaan", 
      path: "/competitions" 
    },
    { 
      icon: Users, 
      label: "Daftar Anggota", 
      path: "/members" 
    },
    { 
      icon: Newspaper, 
      label: isInstruktur ? "Kelola Berita" : "Berita IRMA", 
      path: "/news" 
    },
  ];

  return (
    <>
      <style>{scrollbarStyles}</style>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block shrink-0 sticky top-20 h-[calc(100vh-5rem)] px-6 py-8 overflow-y-auto sidebar-scrollbar transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
        <div className="space-y-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center p-2 text-slate-700 hover:text-slate-900 transition-colors duration-300 mb-4"
            title={isExpanded ? "Persempit Sidebar" : "Perlebar Sidebar"}
          >
            {isExpanded ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          {menuItems.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isSubmenuOpen = item.id && expandedSubmenus[item.id];

            return (
              <div key={idx}>
                <button
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleSubmenu(item.id!);
                    } else if (item.path) {
                      router.push(item.path);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-left ${
                    isActive && !hasSubmenu
                      ? "bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                      : "text-slate-700 hover:bg-linear-to-r hover:from-emerald-100 hover:via-teal-50 hover:to-cyan-100 hover:text-emerald-700 hover:shadow-md"
                  } ${!isExpanded && 'justify-center'}`}
                  title={!isExpanded ? item.label : ''}
                >
                  <IconComponent className="h-5 w-5 shrink-0" />
                  {isExpanded && (
                    <>
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      {hasSubmenu && (
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`}
                        />
                      )}
                    </>
                  )}
                </button>
                
                {/* Submenu */}
                {hasSubmenu && isSubmenuOpen && isExpanded && (
                  <div className="mt-1 ml-4 space-y-1 border-l-2 border-teal-200 pl-3">
                    {item.submenu!.map((subitem: any, subidx: number) => {
                      const SubIconComponent = subitem.icon;
                      const isSubActive = pathname === subitem.path;
                      
                      return (
                        <button
                          key={subidx}
                          onClick={() => router.push(subitem.path)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-left text-sm ${
                            isSubActive
                              ? "bg-linear-to-r from-teal-400 to-cyan-400 text-white shadow-md"
                              : "text-slate-600 hover:bg-linear-to-r hover:from-emerald-100 hover:to-teal-50 hover:text-teal-700"
                          }`}
                        >
                          <SubIconComponent className="h-4 w-4 shrink-0" />
                          <span className="font-medium">{subitem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-500 ease-in-out"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Panel */}
          <div className="fixed z-50 top-0 left-0 h-screen w-3/4 bg-white dark:bg-white border-r border-slate-200 dark:border-slate-200 shadow-2xl animate-in slide-in-from-left duration-500 ease-out rounded-r-3xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-200">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="IRMA Verse" className="h-8 w-8 object-contain" />
                <div>
                  <h2 className="text-xs font-black leading-tight text-white uppercase tracking-wide bg-linear-to-r from-teal-600 to-emerald-600 px-2 py-0.5 rounded-lg">
                    IRMA VERSE
                  </h2>
                  <p className="text-[10px] text-slate-600 mt-0.5">Platform Rohis Digital Irma 13</p>
                </div>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:text-slate-900 transition-colors duration-300"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Items */}
            <div className="px-4 py-4 space-y-2 overflow-y-auto h-[calc(100%-64px)] mobile-sidebar-scrollbar">
              {menuItems.map((item, idx) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.path;
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isSubmenuOpen = item.id && expandedSubmenus[item.id];

                return (
                  <div key={idx}>
                    <button
                      onClick={() => {
                        if (hasSubmenu) {
                          toggleSubmenu(item.id!);
                        } else if (item.path) {
                          setIsMobileOpen(false);
                          router.push(item.path);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left ${
                        isActive && !hasSubmenu
                          ? "bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                          : "text-slate-700 dark:text-slate-700 hover:bg-linear-to-r hover:from-emerald-100 hover:via-teal-50 hover:to-cyan-100 hover:text-emerald-700 dark:hover:text-emerald-700 hover:shadow-md"
                      }`}
                    >
                      <IconComponent className="h-5 w-5 shrink-0" />
                      <span className="text-sm font-semibold flex-1">{item.label}</span>
                      {hasSubmenu && (
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`}
                        />
                      )}
                    </button>
                    
                    {/* Mobile Submenu */}
                    {hasSubmenu && isSubmenuOpen && (
                      <div className="mt-1 ml-4 space-y-1 border-l-2 border-teal-200 pl-3">
                        {item.submenu!.map((subitem: any, subidx: number) => {
                          const SubIconComponent = subitem.icon;
                          const isSubActive = pathname === subitem.path;
                          
                          return (
                            <button
                              key={subidx}
                              onClick={() => {
                                setIsMobileOpen(false);
                                router.push(subitem.path);
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-left text-sm ${
                                isSubActive
                                  ? "bg-linear-to-r from-teal-400 to-cyan-400 text-white shadow-md"
                                  : "text-slate-600 hover:bg-linear-to-r hover:from-emerald-100 hover:to-teal-50 hover:text-teal-700"
                              }`}
                            >
                              <SubIconComponent className="h-4 w-4 shrink-0" />
                              <span className="font-medium">{subitem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;