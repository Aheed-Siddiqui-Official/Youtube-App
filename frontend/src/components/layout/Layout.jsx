import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const authPaths = ["/login", "/signup"];
  const isAuthPath = authPaths.includes(location.pathname);

  if (isAuthPath) {
    // Only render the page content for login/signup
    return <div className="h-screen bg-black text-white">{children}</div>;
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Desktop Sidebar - Toggleable */}
        <aside
          className={`hidden md:block border-r border-gray-700 bg-black transition-all duration-300 ease-out
          ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
        >
          <Sidebar />
        </aside>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300
          ${
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Slide Panel */}
          <aside
            className={`absolute left-0 top-0 h-full w-64 bg-black border-r border-gray-700
            transform transition-transform duration-300 ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
