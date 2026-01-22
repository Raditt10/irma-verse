"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { UserCircle2, UserPlus, Check, X } from "lucide-react"; // Ganti icon Sparkles jadi Check

interface Member {
  id: string;
  name: string;
  role: string;
  class: string;
  avatar: string;
  points: number;
  status: "Aktif" | "Tidak Aktif";
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // State notifikasi
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    loadUser();
    fetchMembers();
  }, []);

  // Timer: Hilang otomatis dalam 3 detik
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadUser = async () => {
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS",
    });
  };

  const fetchMembers = async () => {
    try {
      const mockMembers: Member[] = [
        {
          id: "1",
          name: "Ahmad Syarif",
          role: "Ketua IRMA",
          class: "XII IPA 1",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
          points: 850,
          status: "Aktif",
        },
        {
          id: "2",
          name: "Fatimah Zahra",
          role: "Sekretaris",
          class: "XII IPA 2",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah",
          points: 780,
          status: "Aktif",
        },
        {
          id: "3",
          name: "Muhammad Rizki",
          role: "Bendahara",
          class: "XII IPS 1",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizki",
          points: 720,
          status: "Aktif",
        },
        {
          id: "4",
          name: "Aisyah Putri",
          role: "Koordinator Kajian",
          class: "XI IPA 3",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisyah",
          points: 690,
          status: "Aktif",
        },
        {
          id: "5",
          name: "Abdullah Aziz",
          role: "Koordinator Event",
          class: "XI IPA 2",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah",
          points: 650,
          status: "Aktif",
        },
        {
          id: "6",
          name: "Khadijah",
          role: "Anggota",
          class: "XI IPS 1",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khadijah",
          points: 580,
          status: "Aktif",
        },
      ];
      setMembers(mockMembers);
    } catch (error: any) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Pesan simple & profesional
  const handleAddFriend = (name: string) => {
    setToast({
      show: true,
      message: `Permintaan dikirim ke ${name}`,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 relative"
      style={{
        fontFamily:
          "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive",
      }}
    >
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-800 mb-2">
                Daftar Anggota
              </h1>
              <p className="text-slate-600 text-lg">
                Anggota aktif IRMA Verse dan kontribusi mereka
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat anggota...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    <div className="p-6">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-teal-100 shadow-lg">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Name & Role */}
                      <div className="text-center mb-3">
                        <h3 className="text-xl font-bold text-slate-800 mb-1">
                          {member.name}
                        </h3>
                        <p className="text-teal-600 text-sm font-semibold mb-1">
                          {member.role}
                        </p>
                        <p className="text-slate-500 text-sm">{member.class}</p>
                      </div>

                      {/* Points & Status */}
                      <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">
                            Poin Keaktifan
                          </p>
                          <p className="text-2xl font-bold text-teal-600">
                            {member.points}
                          </p>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                          {member.status}
                        </div>
                      </div>

                      {/* Button */}
                      <button
                        onClick={() => router.push(`/members/${member.id}`)}
                        className="w-full py-3 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <UserCircle2 className="h-5 w-5" />
                        Lihat Profile
                      </button>
                      
                      {/* Tambahkan Teman Button */}
                      <button
                        className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-semibold hover:from-emerald-500 hover:to-teal-500 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                        onClick={() => handleAddFriend(member.name)}
                      >
                        <UserPlus className="h-5 w-5" />
                        Tambahkan Teman
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatbotButton />

      {/* --- NOTIFIKASI SIMPLE & PROFESIONAL (Pill Style) --- */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 bg-slate-900/95 backdrop-blur-sm text-white px-5 py-3 rounded-full shadow-2xl animate-[slideDown_0.4s_ease-out] border border-white/10">
                
                {/* Icon Check Hijau */}
                <div className="bg-emerald-500 rounded-full p-1 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white stroke-[3]" />
                </div>
                
                {/* Text Message */}
                <span className="text-sm font-medium tracking-wide pr-2" style={{ fontFamily: "sans-serif" }}>
                    {toast.message}
                </span>

                {/* Close Button (Optional, simple X) */}
                <button 
                    onClick={() => setToast(null)}
                    className="ml-2 text-slate-400 hover:text-white transition-colors border-l border-white/10 pl-3"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
      )}

      {/* Animasi Slide Down Custom */}
      <style jsx>{`
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
};

export default Members;