import { Logo } from "./Logo";

interface HeaderProps {
  onNavigate: () => void;
}

export function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group text-xl" onClick={onNavigate}>
            <Logo style={{ height: '2.5em', lineHeight: 1 }} />
            <span className="font-semibold text-2xl text-gray-900 tracking-tight font-zalando-expanded">HawkShot</span>
          </div>
          
        </div>
      </div>
    </header>
  );
}
