"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface ScheduleDetailButtonProps {
  scheduleId: string;
}

export default function ScheduleDetailButton({ scheduleId }: ScheduleDetailButtonProps) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push(`/schedule/${scheduleId}`)}
      className="w-full py-3.5 rounded-2xl bg-teal-400 text-white font-black text-sm border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 group/btn"
    >
      <span>Lihat Detail Event</span>
      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={3} />
    </button>
  );
}
