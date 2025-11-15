import React from "react";
import { Target } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onNavigate("home")}>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight font-zalando-expanded">HawkShot</span>
          </div>
          
          <nav className="flex items-center gap-8">
            <button
              onClick={() => onNavigate("home")}
              className={`text-sm font-medium transition-colors ${
                currentPage === "home"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("compare")}
              className={`text-sm font-medium transition-colors ${
                currentPage === "compare"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Compare
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
