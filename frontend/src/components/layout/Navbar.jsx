import { Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-black border-b border-gray-700 flex items-center px-4 relative">
      <button onClick={onMenuClick} className="md:hidden text-white mr-4">
        <Menu size={24} />
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
            <span className="text-white hidden sm:block">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
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
