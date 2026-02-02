import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../store/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, error, isLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/"); // redirect after login
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <form
          className="w-full max-w-md text-center space-y-6"
          onSubmit={handleSubmit}
        >
          <img src="/Logo.png" alt="Logo" className="h-12 mx-auto mb-4" />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading && !user}
            className="w-full bg-purple-500 py-2 rounded font-semibold hover:bg-purple-400 transition"
          >
            {isLoading && !user ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-white underline">
              Sign Up
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Login;
