import Image from "next/image";
import { User } from "lucide-react";

export default function Navigation() {
  const handleUserClick = () => {
    console.log("User profile clicked!");
    // Add your user profile logic here
  };

  const handleNavClick = (page: string) => {
    console.log(`Navigating to ${page}`);
    // Add navigation logic here
  };

  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-black fixed top-0 left-0 z-50">
      <div className="flex items-center space-x-8">
        <a
          href="/"
          className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-200 hover:scale-105"
        >
          Home
        </a>
        <a
          href="/stats"
          className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-200 hover:scale-105"
        >
          Stats
        </a>
        <a
          href="/history"
          className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-200 hover:scale-105"
        >
          History
        </a>
      </div>

      <div className="flex items-center">
        <Image
          src="/logo2.png"
          alt="Logo"
          width={100}
          height={104}
          className="object-contain"
          priority
        />
      </div>

      <div className="flex justify-end">
        <a
          href="/profile"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50"
        >
          <User className="w-4 h-4 text-gray-300 hover:text-blue-400 transition-colors" />
        </a>
      </div>
    </nav>
  );
}
