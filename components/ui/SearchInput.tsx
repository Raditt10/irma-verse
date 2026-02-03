"use client";
import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Cari...",
  value,
  onChange,
  className = "w-full lg:w-80",
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-5 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-teal-400 focus:bg-white transition-all font-medium placeholder:text-slate-400"
      />
    </div>
  );
};

export default SearchInput;
