"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RememberMeCheckbox from "@/components/ui/RememberMeCheckbox";
// Import icons tambahan: Eye, EyeOff, Check
import { Loader2, Eye, EyeOff, Check } from "lucide-react"; 

// --- SUB-COMPONENT: Password Input dengan Toggle ---
const PasswordInput = ({ id, name, placeholder, required = false, minLength = 0 }: any) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative group">
      <Input
        id={id}
        name={name}
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        // Styling Cartoon Professional: Border tebal saat fokus, font medium
        className="py-6 pr-12 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-0 focus:shadow-[4px_4px_0_0_#10b981] transition-all font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-400"
      />
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1 rounded-md focus:outline-none"
        tabIndex={-1} // Agar tidak bisa di-tab, user fokus ke input
      >
        {isVisible ? (
          <EyeOff className="h-5 w-5" strokeWidth={2.5} />
        ) : (
          <Eye className="h-5 w-5" strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Registrasi berhasil! Silakan login.");
    }
  }, [searchParams]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("full-name") as string;
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Terjadi kesalahan saat registrasi");
        setIsLoading(false);
        return;
      }

      setSuccess("Registrasi berhasil! Silakan login.");
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => {
        const signinButton = document.querySelector('[value="signin"]') as HTMLElement;
        if (signinButton) signinButton.click();
      }, 500);
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signin-email") as string;
    const password = formData.get("signin-password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
        setIsLoading(false);
      } else if (result?.ok) {
        setSuccess("Login berhasil! Mengalihkan...");
        
        const response = await fetch("/api/users/profile");
        const userData = await response.json();
        
        let redirectUrl = "/overview";
        if (userData.role === "ADMIN") redirectUrl = "/admin";
        else if (userData.role === "INSTRUCTOR") redirectUrl = "/instructor";
        
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-center items-center overflow-hidden bg-white" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 w-screen h-screen pointer-events-none select-none">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
          <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="150" fill="none" stroke="#059669" strokeWidth="1"/>
            <circle cx="200" cy="200" r="100" fill="none" stroke="#059669" strokeWidth="1"/>
            <circle cx="200" cy="200" r="50" fill="none" stroke="#059669" strokeWidth="1"/>
            <g transform="translate(200,200)">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line key={i} x1="0" y1="0" x2={`${150 * Math.cos(angle * Math.PI / 180)}`} y2={`${150 * Math.sin(angle * Math.PI / 180)}`} stroke="#059669" strokeWidth="1"/>
              ))}
            </g>
          </svg>
        </div>
        <div className="absolute top-10 left-10 text-emerald-200 text-3xl"></div>
        <div className="absolute top-20 right-20 text-emerald-100 text-2xl"></div>
        <div className="absolute bottom-32 left-1/4 text-emerald-150 text-2xl"></div>
        <div className="absolute bottom-20 right-1/3 text-emerald-100 text-3xl"></div>
        <svg className="absolute top-1/4 right-1/4 w-16 h-16 opacity-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 50 20 Q 30 30 30 50 Q 30 70 50 80 Q 45 75 45 50 Q 45 25 50 20" fill="#059669"/>
        </svg>
        <div className="absolute top-1/3 left-5 w-3 h-3 bg-emerald-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-1/4 right-10 w-4 h-4 bg-emerald-300 rounded-full opacity-15"></div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8 relative z-10 w-full min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl items-center">
    
          {/* Card Form */}
          <div className="bg-white/95 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 sm:p-10 flex flex-col justify-center w-full max-w-md border-2 border-slate-100 backdrop-blur-md mx-auto relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>

            <div className="flex flex-col items-center gap-2 mb-8">
              <img src="/logo.png" alt="IRMA Verse" className="h-12 w-12 object-contain drop-shadow-md hover:scale-110 transition-transform" />
              <div className="text-center">
                <div className="font-black text-3xl text-emerald-600 tracking-tight">IRMA Verse</div>
                <div className="text-sm text-slate-400 font-bold tracking-wide uppercase">Platform Rohis Digital</div>
              </div>
            </div>
            
            <h2 className="text-2xl font-black mb-2 text-slate-800 text-center">Selamat Datang! 👋</h2>
            <p className="text-slate-500 mb-8 text-center text-sm font-medium">Ayo lanjutkan perjalanan spiritualmu.</p>
            
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 p-2 bg-gradient-to-b from-slate-100 to-slate-200 rounded-3xl shadow-[0_8px_0_0_#cbd5e1]">
                <TabsTrigger value="signin" className="rounded-3xl py-3 px-4 font-black transition-all hover:scale-105 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-[0_4px_0_0_#059669] text-slate-600">Masuk</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-3xl py-3 px-4 font-black transition-all hover:scale-105 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-[0_4px_0_0_#059669] text-slate-600">Daftar</TabsTrigger>
              </TabsList>

              {/* === FORM SIGN IN === */}
              <TabsContent value="signin" className="animate-in fade-in-50 zoom-in-95 duration-300">
                <form onSubmit={handleSignIn} className="space-y-5">
                  {error && <div className="rounded-xl bg-red-50 p-4 border-2 border-red-100 text-center"><p className="text-sm text-red-600 font-bold">{error}</p></div>}
                  {success && <div className="rounded-xl bg-emerald-50 p-4 border-2 border-emerald-100 text-center"><p className="text-sm text-emerald-600 font-bold">{success}</p></div>}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-slate-600 font-bold text-sm ml-1">Email</Label>
                    <Input
                        id="signin-email"
                        name="signin-email"
                        type="email"
                        placeholder="contoh@sekolah.sch.id"
                        required
                        className="py-6 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-0 focus:shadow-[4px_4px_0_0_#10b981] transition-all font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-slate-600 font-bold text-sm ml-1">Kata Sandi</Label>
                    {/* Menggunakan Custom Password Input */}
                    <PasswordInput 
                      id="signin-password"
                      name="signin-password"
                      placeholder="••••••••"
                      required={true}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm mt-2">
                    {/* Menggunakan Custom Checkbox */}
                    <RememberMeCheckbox />
                    
                    <a href="#" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">Lupa sandi?</a>
                  </div>

                  <Button type="submit" className="w-full rounded-xl py-6 text-base font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_0_0_#047857] active:shadow-none active:translate-y-1 transition-all border-2 border-emerald-600 mt-4" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</> : "Masuk Sekarang"}
                  </Button>
                </form>
              </TabsContent>

              {/* === FORM SIGN UP === */}
              <TabsContent value="signup" className="animate-in fade-in-50 zoom-in-95 duration-300">
                <form onSubmit={handleSignUp} className="space-y-5">
                  {error && <div className="rounded-xl bg-red-50 p-4 border-2 border-red-100 text-center"><p className="text-sm text-red-600 font-bold">{error}</p></div>}
                  {success && <div className="rounded-xl bg-emerald-50 p-4 border-2 border-emerald-100 text-center"><p className="text-sm text-emerald-600 font-bold">{success}</p></div>}
                  
                  <div className="space-y-2">
                    <Label htmlFor="full-name" className="text-slate-600 font-bold text-sm ml-1">Nama Lengkap</Label>
                    <Input
                        id="full-name"
                        name="full-name"
                        type="text"
                        placeholder="Nama Lengkap"
                        required
                        className="py-6 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-0 focus:shadow-[4px_4px_0_0_#10b981] transition-all font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-600 font-bold text-sm ml-1">Email</Label>
                    <Input
                        id="signup-email"
                        name="signup-email"
                        type="email"
                        placeholder="nama@email.com"
                        required
                        className="py-6 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-0 focus:shadow-[4px_4px_0_0_#10b981] transition-all font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-600 font-bold text-sm ml-1">Kata Sandi</Label>
                    <PasswordInput 
                      id="signup-password"
                      name="signup-password"
                      placeholder="Minimal 6 karakter"
                      required={true}
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-slate-600 font-bold text-sm ml-1">Konfirmasi Kata Sandi</Label>
                    <PasswordInput 
                      id="confirm-password"
                      name="confirm-password"
                      placeholder="Ulangi kata sandi"
                      required={true}
                      minLength={6}
                    />
                  </div>

                  <Button type="submit" className="w-full rounded-xl py-6 text-base font-black bg-teal-500 hover:bg-teal-600 text-white shadow-[0_4px_0_0_#0f766e] active:shadow-none active:translate-y-1 transition-all border-2 border-teal-600 mt-4" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mendaftarkan...</> : "Daftar Akun"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Side Illustration Text (Desktop) */}
          <div className="hidden md:flex flex-col justify-center items-center text-center px-6">
            <div className="mb-10 relative transform hover:scale-105 transition-transform duration-500">
              <svg width="280" height="160" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                <ellipse cx="110" cy="90" rx="60" ry="30" fill="#14b8a6" fillOpacity="0.2" />
                <rect x="90" y="60" width="40" height="40" rx="12" fill="white" stroke="#10b981" strokeWidth="3" />
                <circle cx="110" cy="80" r="14" stroke="#10b981" strokeWidth="3" fill="white" />
                <path d="M105 80 L110 85 L115 75" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="60" cy="60" r="4" fill="#34d399" />
                <circle cx="160" cy="60" r="6" fill="#34d399" fillOpacity="0.6" />
                <circle cx="110" cy="40" r="8" fill="#34d399" fillOpacity="0.4" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Komunitas Islami Modern</h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm mx-auto">
                Kelola aktivitas rohis, kajian, dan event islami sekolah dengan cara yang lebih <span className="text-emerald-600 font-bold underline decoration-wavy">menyenangkan</span> dan terorganisir.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    }>
      <Auth />
    </Suspense>
  );
}