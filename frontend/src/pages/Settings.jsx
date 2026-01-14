import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCurrentUser,
  updateAccount,
  updateAvatar,
  updateCoverImage,
  changePassword,
  authActions,
} from "../store/slices/authSlice.js";

const Settings = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  // Form states
  const [fullName, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");

  // Load current user on mount
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Pre-fill form when user data arrives
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setUserName(user.username || "")
    }
  }, [user]);

  const handleProfileSubmit = async () => {
    setMessage("");
    try {
      // 1️⃣ Update account info if changed
      if (
        (fullName && fullName !== user.fullName) ||
        (email && email !== user.email) ||
        (username && username !== user.username)
      ) {
        const updatedUser = await dispatch(
          updateAccount({
            username: username || user.username,
            fullName: fullName || user.fullName,
            email: email || user.email,
          })
        ).unwrap();
        dispatch(authActions.setUser(updatedUser)); // update redux state
      }

      // 2️⃣ Update avatar if selected
      if (avatarFile) {
        const updatedUser = await dispatch(updateAvatar(avatarFile)).unwrap();
        dispatch(authActions.setUser(updatedUser));
        setAvatarFile(null);
      }

      // 3️⃣ Update cover image if selected
      if (coverFile) {
        const updatedUser = await dispatch(
          updateCoverImage(coverFile)
        ).unwrap();
        dispatch(authActions.setUser(updatedUser));
        setCoverFile(null);
      }

      setMessage("Profile updated successfully!");
    } catch (err) {
      // err will be backend error
      console.error(err);
    }
  };

  // Password change separately
  const handlePasswordSubmit = async () => {
    setMessage("");
    if (!oldPassword || !newPassword) return;
    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
      setOldPassword("");
      setNewPassword("");
      setMessage("Password changed successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold border-b border-gray-700 pb-4">
          Account Settings
        </h1>

        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}

        {/* Profile Info + Avatar + Cover */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Profile Information</h2>
          <input
            type="text"
            placeholder="User Name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Avatar */}
          <div className="mt-2">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:bg-gray-700 file:text-white
                hover:file:bg-gray-600"
            />
          </div>

          {/* Cover Image */}
          <div className="mt-2">
            {user?.coverImage && (
              <img
                src={user.coverImage}
                alt="Cover"
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:bg-gray-700 file:text-white
                hover:file:bg-gray-600"
            />
          </div>

          <button
            onClick={handleProfileSubmit}
            className="mt-3 bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded font-medium"
            disabled={isLoading}
          >
            Update Profile
          </button>
        </section>

        <hr className="border-gray-800" />

        {/* Password */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlePasswordSubmit}
            className="mt-3 bg-red-600 hover:bg-red-500 px-5 py-2 rounded font-medium"
            disabled={isLoading}
          >
            Change Password
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
