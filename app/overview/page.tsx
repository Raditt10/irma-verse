"use client";
import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Bell,
  Award,
  Trophy,
  MessageCircle,
  TrendingUp,
  BarChart3,
  Sparkles,
  Flame,
  Star,
  MessageSquare,
  Newspaper,
  ArrowRight,
  Zap,
} from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import DashboardHeader from "@/components/ui/DashboardHeader";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Komponen LevelCardContent (Placeholder agar tidak error)
const LevelCardContent = () => (
  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 rounded-2xl text-white shadow-lg">
    <div className="flex justify-between items-center mb-2">
      <span className="font-bold text-sm">Level 5</span>
      <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">Mashaallah</span>
    </div>
    <div className="h-2 bg-black/10 rounded-full overflow-hidden">
      <div className="h-full bg-white w-3/4 rounded-full" />
    </div>
    <p className="text-xs mt-2 font-medium">2450 / 3000 XP untuk Level 6</p>
  </div>
);

const Dashboard = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
  });
  const router = useRouter();

  // Redirect non-user roles away from overview
  React.useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "instruktur") {
        router.replace("/academy");
      } else if (session?.user?.role === "admin") {
        router.replace("/admin");
      }
    }
  }, [status, session, router]);
    
  const stats = {
    totalPoints: 2450,
    totalBadges: 8,
    totalQuizzes: 24,
    averageScore: 87,
    streak: 7,
  };

  const quickActions = [
    { title: "Pengumuman", icon: Bell, link: "/announcements" },
    { title: "Jadwal", icon: Calendar, link: "/materials" },
    { title: "Materi", icon: BookOpen, link: "/archivesch" },
    { title: "Kuis", icon: Trophy, link: "/quiz" },
    { title: "Diskusi", icon: MessageCircle, link: "/chat-rooms" },
    { title: "Peringkat", icon: TrendingUp, link: "/leaderboard" },
  ];

  // Data Berita (DUMMY DATA - karena data asli terhapus error)
  const newsItems = [
    {
      id: 1,
      title: "Kegiatan Ramadhan 1446H Dimulai!",
      category: "Event",
      date: "12 Maret 2025",
      imageId: "10"
    },
    {
      id: 2,
      title: "Selamat Kepada Juara Lomba Adzan",
      category: "Prestasi",
      date: "10 Maret 2025",
      imageId: "15"
    }
  ];

  // 1. Cek loading atau role di sini, BUKAN di dalam array newsItems
  if (status === "loading") return null;
  if (session?.user?.role !== "user") return null;

  // 2. Return JSX utama ada di sini
  return (
    <div className="min-h-screen bg-slate-50/50" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="w-full md:w-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                ٱلسَّلَامُ عَلَيْكُمْ, <span className="text-teal-600">{session?.user?.name}</span>
              </h1>
              <p className="text-slate-500 mt-1">Siap menambah ilmu hari ini?</p>
              {/* --- [MOBILE] CARD LEVEL --- */}
              <div className="mt-6 xl:hidden block w-full">
                <LevelCardContent />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <Calendar className="w-4 h-4 text-slate-900" />
              <span className="text-sm font-bold text-slate-600">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
          {/* MAIN GRID LAYOUT */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
            {/* LEFT COLUMN */}
            <div className="xl:col-span-8 space-y-8">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-xl group-hover:border-slate-400 transition-colors shadow-sm">
                      <Award className="w-6 h-6 text-slate-900" />
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-full text-slate-500">Total</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{stats.totalBadges}</div>
                  <div className="text-sm text-slate-500 font-bold">Badges Dikoleksi</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-xl group-hover:border-slate-400 transition-colors shadow-sm">
                      <BarChart3 className="w-6 h-6 text-slate-900" />
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-green-100 rounded-full text-green-600">Rata rata {stats.averageScore}%</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{stats.totalQuizzes}</div>
                  <div className="text-sm text-slate-500 font-bold">Kuis Selesai</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-xl group-hover:border-slate-400 transition-colors shadow-sm">
                      <Flame className="w-6 h-6 text-slate-900" />
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-rose-100 rounded-full text-rose-600">Mantap!</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{stats.streak} Hari</div>
                  <div className="text-sm text-slate-500 font-bold">Konsistensi</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-white border border-slate-200 rounded-xl group-hover:border-slate-400 transition-colors shadow-sm">
                    <Sparkles className="w-6 h-6 text-slate-900" />
                  </div>
                  <span className="text-base font-bold text-slate-800">Fitur pintar</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <Link key={idx} href={action.link} className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-3 group-hover:border-slate-800 group-hover:shadow-md transition-all">
                          <Icon className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{action.title}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
              {/* News Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-slate-900" />
                    <h2 className="text-lg font-bold text-slate-800">Kabar IRMA Terkini</h2>
                  </div>
                </div>
                {/* Updated Grid for News Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newsItems.map((news) => (
                    <div key={news.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                      <div className="w-24 h-24 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                        <img src={`https://picsum.photos/200/200?random=${news.imageId}`} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-xs font-bold text-teal-600 mb-1">{news.category}</span>
                        <h3 className="font-bold text-slate-800 leading-tight mb-2 text-sm md:text-base group-hover:text-teal-600 transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {news.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            {/* RIGHT COLUMN */}
            <div className="xl:col-span-4 space-y-6">
              {/* --- [DESKTOP] CARD LEVEL --- */}
              <div className="hidden xl:block">
                <LevelCardContent />
              </div>
              {/* Feature Cards Stack */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-slate-900" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">Tantangan Harian</h4>
                    <p className="text-xs text-slate-500 font-bold">Selesaikan hafalan surat pendek</p>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors">Mulai</button>
                </div>
                {/* Ci Irma Chatbot Promo */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-5 rounded-2xl border border-cyan-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img src="/ci irma.jpg" alt="AI" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Ci Irma AI</h4>
                      <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 font-bold">Butuh teman diskusi atau tanya jadwal? Irma siap bantu!</p>
                  <button className="w-full py-2.5 bg-white text-slate-700 font-bold text-sm rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Chat Sekarang
                  </button>
                </div>
                {/* Instruktur Promo */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-3 text-sm">Instruktur Pilihan</h4>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                      <img src="/instruktur.jpg" alt="Instruktur" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Ust. Ahmad</p>
                      <p className="text-xs text-slate-500 font-bold">Fiqih & Ibadah</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors">
                    Jadwalkan Konsultasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default Dashboard;