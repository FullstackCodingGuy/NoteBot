import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, Home, Settings, User } from "lucide-react";

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-gray-900 text-white w-64 p-4 transition-all duration-300",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
            <Home size={18} /> Home
          </a>
          <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
            <User size={18} /> Profile
          </a>
          <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
            <Settings size={18} /> Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </Button>
          <span className="font-semibold text-lg">Dashboard</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm">John Doe</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 bg-gray-100 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Dashboard;
