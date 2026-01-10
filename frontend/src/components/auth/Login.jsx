import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <form className="w-full max-w-md text-center space-y-6">
          {/* Logo */}
          <a href="/">
            <img src="/Logo.png" alt="Logo" className="h-12 mx-auto mb-4" />
          </a>

          {/* Inputs */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-500 py-2 rounded font-semibold hover:bg-purple-400 transition"
          >
            Continue
          </button>

          {/* Redirect to login */}
          <p className="text-sm text-gray-400">
            If you don't have account?{" "}
            <Link to="/signup" className="text-white underline">
              SignUp
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Login;
