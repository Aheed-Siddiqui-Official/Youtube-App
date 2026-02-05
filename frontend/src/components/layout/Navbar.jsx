import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";
import { useState } from "react";

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate("/login");
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
    onMenuClick?.();
  };

  return (
    <header className="h-16 bg-black border-b border-gray-700 flex items-center px-4 relative">
      <button 
        onClick={handleMenuClick} 
        className="text-white mr-4 hover:bg-gray-800 p-2 rounded transition-colors"
        title="Toggle sidebar"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <Link to="/">
        <img src="/Logo.png" alt="Logo" className="h-15" />
      </Link>

      <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block w-1/2 max-w-xl">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="ml-auto flex gap-3 items-center">
        {isAuthenticated ? (
          <>
            <a href="/dashboard">
              <img
                src={user?.avatar}
                alt="avatar"
                className="
    w-9 h-9 
    rounded-full 
    object-cover 
    border-2 border-gray-700
    hover:border-blue-500
    transition-all duration-200
    cursor-pointer
    hidden sm:block
  "
              />
            </a>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:text-white mt-2"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
