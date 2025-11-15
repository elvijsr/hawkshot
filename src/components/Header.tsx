import { Logo } from "./Logo";

interface HeaderProps {
  onNavigate: () => void;
}

export function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-center">
          <div className="flex items-center gap-2 cursor-pointer group text-xl" onClick={onNavigate}>
            <Logo style={{ height: '2.5em', lineHeight: 1 }} />
            <span className="font-semibold text-3xl text-gray-900 tracking-tight font-bayon">HawkShot</span>
          </div>
          
        </div>
      </div>
    </header>
  );
}
