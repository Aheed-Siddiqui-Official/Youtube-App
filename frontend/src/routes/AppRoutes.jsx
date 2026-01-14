import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Liked from "../pages/Liked";
import History from "../pages/History";
import Playlist from "../pages/Playlist";
import Dashboard from "../pages/Dashboard";
import Collection from "../pages/Collection";
import Community from "../pages/Community";
import SignUp from "../components/auth/SignUp";
import Login from "../components/auth/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/liked" element={<Liked />} />
      <Route path="/history" element={<History />} />
      <Route path="/playlist" element={<Playlist />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/community" element={<Community />} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>
  );
};

export default AppRoutes;
