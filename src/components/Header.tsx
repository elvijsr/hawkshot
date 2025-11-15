import { Shield } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("home")}>
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-gray-900">TrustScore</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <button
              onClick={() => onNavigate("home")}
              className={`transition-colors ${
                currentPage === "home"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("compare")}
              className={`transition-colors ${
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
