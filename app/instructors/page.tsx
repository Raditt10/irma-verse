"use client";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Star, BookOpen, Users, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Instructor {
  id: string;
  name: string;
  specialization: string;
  description: string;
  avatar: string;
  rating: number;
  studentsCount: number;
  kajianCount: number;
  tags: string[];
  verified: boolean;
  featured?: boolean;
}

const Instructors = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await fetch("/api/instructors");
      if (!res.ok) throw new Error("Gagal mengambil data instruktur");
      const data = await res.json();
      
      const mapped = data.map((u: any) => ({
        id: u.id,
        name: u.name || "-",
        specialization: u.bidangKeahlian || "-",
        description: u.pengalaman || "-",
        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || "user"}`,
        rating: u.rating || 0,
        studentsCount: u.studentsCount || 0,
        kajianCount: u.kajianCount || 0,
        tags: ["Fiqih", "Tafsir", "Hadits"],
        verified: true,
        featured: u.featured || false,
      }));
      setInstructors(mapped);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-slate-500 font-bold animate-pulse">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                  Daftar Instruktur
                </h1>
                <p className="text-slate-500 text-lg font-medium">
                  Para instruktur terbaik kami yang siap membimbing kamu! 🎓
                </p>
              </div>
              <div className="bg-white p-3 rounded-[1.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] -rotate-2 hidden md:block">
                <Users className="w-8 h-8 text-teal-500" strokeWidth={2.5} />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <Sparkles className="h-10 w-10 text-teal-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-bold">Mencari instruktur...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className={`bg-white rounded-[2.5rem] border-2 transition-all duration-300 overflow-hidden group hover:-translate-y-2 flex flex-col relative ${
                      instructor.featured 
                        ? 'border-amber-400 shadow-[0_8px_0_0_#fbbf24]' 
                        : 'border-slate-200 shadow-[0_8px_0_0_#cbd5e1] hover:border-teal-400 hover:shadow-[0_8px_0_0_#34d399]'
                    }`}
                  >
                    {instructor.featured && (
                      <div className="absolute top-4 right-4 z-10 bg-amber-400 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-amber-500 shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> Featured
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4 mt-2">
                        <div className="relative group-hover:scale-105 transition-transform duration-300">
                          <div className={`w-28 h-28 rounded-full overflow-hidden border-4 shadow-lg ${
                             instructor.featured ? 'border-amber-200' : 'border-teal-100'
                          }`}>
                            <img
                              src={instructor.avatar}
                              alt={instructor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Badge Verifikasi dihapus di sini */}
                        </div>
                      </div>

                      {/* Name & Specialization */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight">
                          {instructor.name}
                        </h3>
                        <p className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full inline-block border border-teal-100">
                          {instructor.specialization}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-slate-500 text-sm text-center mb-5 line-clamp-2 font-medium px-2">
                        {instructor.description}
                      </p> 

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {instructor.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats Widget */}
                      <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="text-center border-r border-slate-200">
                          <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-black text-lg">{instructor.rating}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Rating</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <span className="font-black text-lg text-slate-700">{instructor.kajianCount}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Kajian</p>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-3 mt-auto">
                        {session?.user?.id !== instructor.id ? (
                          <>
                            <Link
                              href={`/instructors/chat?instructorId=${encodeURIComponent(instructor.id)}`}
                              className="w-full py-3 rounded-xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 group/btn"
                            >
                              <MessageCircle className="w-5 h-5 group-hover/btn:animate-bounce" strokeWidth={2.5} />
                              Mulai Chat
                            </Link>
                            
                            <button className="w-full py-3 rounded-xl bg-white text-slate-600 font-bold border-2 border-slate-200 border-b-4 hover:bg-slate-50 hover:text-slate-800 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              Lihat Kajian
                            </button>
                          </>
                        ) : (
                          <button className="w-full py-3 rounded-xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2">
                            Lihat Profile Saya
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default Instructors;