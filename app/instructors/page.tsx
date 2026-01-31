"use client";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Star, BookOpen, Users, MessageCircle, Award, Plus } from "lucide-react";
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
      // Map jika ada field yang tidak sesuai
      const mapped = data.map((u: any) => ({
        id: u.id,
        name: u.name || "-",
        specialization: u.bidangKeahlian || "-",
        description: u.pengalaman || "-",
        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || "user"}`,
        rating: u.rating || 0,
        studentsCount: u.studentsCount || 0,
        kajianCount: u.kajianCount || 0,
        tags: [],
        verified: true,
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
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-black text-slate-800 mb-1">
                  Daftar Instruktur
                </h1>
                <p className="text-slate-600 text-lg">
                  Para instruktur terbaik kami yang siap membimbing kamu!
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat instruktur...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className={`bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 ${
                      instructor.featured ? 'ring-2 ring-teal-500/50' : ''
                    }`}
                  >
                    <div className="p-6">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-teal-100 shadow-lg">
                            <img
                              src={instructor.avatar}
                              alt={instructor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Name & Specialization */}
                      <div className="text-center mb-4">
                        <h3 className={`text-xl font-bold mb-1 ${
                          instructor.featured ? 'text-teal-600' : 'text-slate-800'
                        }`}>
                          {instructor.name}
                        </h3>
                        <p className="text-slate-600 text-sm font-semibold">
                          {instructor.specialization}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-slate-500 text-sm text-center mb-4 line-clamp-2">
                        {instructor.description}
                      </p> 

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {instructor.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-100 justify-items-center">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-bold">{instructor.rating}</span>
                          </div>
                          <p className="text-xs text-slate-500">Rating</p>
                        </div>
                        {/* Murid stat removed */}
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <span className="font-bold text-slate-700">{instructor.kajianCount}</span>
                          </div>
                          <p className="text-xs text-slate-500">Mengisi Kajian Mingguan</p>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-2">
                        {session?.user?.id !== instructor.id ? (
                          <>
                            <Link
                              href={`/instructors/chat?instructorId=${encodeURIComponent(instructor.id)}`}
                              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-md hover:from-teal-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 mb-2"
                            >
                              Mulai Chat
                            </Link>
                            <button className="w-full py-3 rounded-xl bg-white border-2 border-teal-500 text-teal-600 font-semibold hover:bg-teal-50 transition-all duration-300 flex items-center justify-center gap-2">
                              Lihat Kajian
                            </button>
                          </>
                        ) : (
                          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-md hover:from-teal-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2">
                            Lihat profile saya
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