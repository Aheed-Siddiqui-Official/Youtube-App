import React from 'react'

const Navbar = () => {
  return (
      
    <header className="bg-black px-4 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Logo */}
        <img
          src="/Logo.png"
          alt="Logo"
          className="h-10 w-auto mx-auto sm:mx-0"
        />

        {/* Search */}
        <input
          type="text"
          placeholder="Search"
          className="w-full sm:w-1/3 px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Actions */}
        <div className="flex justify-center sm:justify-end gap-3">
          <button className="bg-transparent text-blue-500 font-semibold py-2 px-4 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition">
            Login
          </button>

          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-400 transition">
            Sign up
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
