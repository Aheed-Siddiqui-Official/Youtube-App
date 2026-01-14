import { NavLink } from "react-router-dom";
import {
  Home,
  ThumbsUp,
  History,
  ListVideo,
  Folder,
  Users,
  LayoutDashboard,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Liked Videos", path: "/liked", icon: ThumbsUp },
  { name: "History", path: "/history", icon: History },
  { name: "Playlist", path: "/playlist", icon: ListVideo },
  { name: "Collection", path: "/collection", icon: Folder },
  { name: "Community", path: "/community", icon: Users },
];

const Sidebar = ({ onClose }) => {
  return (
    <div className="h-full flex flex-col p-4 overflow-hidden bg-black">
      {/* Mobile Close */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden mb-4 flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <X size={18} />
          Close
        </button>
      )}

      {/* Main Nav */}
      <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            end={path === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3 rounded border transition-all
              ${
                isActive
                  ? "bg-gray-800 text-white border-gray-600"
                  : "text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator */}
                <span
                  className={`absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r
                  transition-transform duration-300 origin-top
                  ${isActive ? "scale-y-100" : "scale-y-0"}`}
                />

                <Icon size={20} className="shrink-0" />
                <span className="font-medium">{name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-4 space-y-2 border-t border-gray-800 pt-4">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          onClick={onClose}
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-4 py-3 rounded border transition-all
            ${
              isActive
                ? "bg-blue-600 text-white border-blue-500"
                : "text-white border-gray-700 hover:bg-gray-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard size={20} />
              <span className="font-semibold">Dashboard</span>
              {isActive && (
                <span className="absolute inset-0 rounded bg-blue-500/10" />
              )}
            </>
          )}
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-4 py-3 rounded border transition-all
            ${
              isActive
                ? "bg-gray-800 text-white border-gray-600"
                : "text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings size={20} />
              <span className="font-medium">Settings</span>
              {isActive && (
                <span className="absolute inset-0 rounded bg-blue-500/5" />
              )}
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;


