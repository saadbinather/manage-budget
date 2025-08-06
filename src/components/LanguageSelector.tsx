"use client";
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: "en",
      name: "English",
      flag: "🇺🇸",
    },
    {
      code: "es",
      name: "Español",
      flag: "🇪🇸",
    },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-blue-400 font-medium transition-colors duration-200 hover:scale-105"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span>{currentLanguage?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as "en" | "es");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-50 ${
                language === lang.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && (
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 