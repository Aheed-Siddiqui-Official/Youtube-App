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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Password validation function
  const validatePassword = (pwd) => {
    const errors = [];
    
    if (pwd.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("One uppercase letter (A-Z)");
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push("One lowercase letter (a-z)");
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push("One number (0-9)");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      errors.push("One special character (!@#$%^&* etc)");
    }

    return errors;
  };

  const handleNewPasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    if (pwd) {
      const errors = validatePassword(pwd);
      setPasswordError(errors.length > 0 ? errors.join(", ") : "");
    } else {
      setPasswordError("");
    }
  };

  const isPasswordValid = () => {
    return newPassword && validatePassword(newPassword).length === 0;
  };

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
    setSuccessMessage("");
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

      setSuccessMessage("✓ Profile updated successfully!");
    } catch (err) {
      setMessage(err.message || "Failed to update profile");
      console.error(err);
    }
  };

  // Password change separately
  const handlePasswordSubmit = async () => {
    setMessage("");
    setSuccessMessage("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }
    if (!isPasswordValid()) {
      setMessage("Password does not meet security requirements");
      return;
    }
    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setSuccessMessage("✓ Password changed successfully!");
    } catch (err) {
      setMessage(err.message || "Failed to change password");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-3 sm:px-4 md:px-6 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage your account information and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-900/20 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {successMessage}
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-purple-400 mb-6">Profile Information</h2>

          <div className="space-y-4 sm:space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>

            {/* Avatar */}
            <div className="pt-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-3">Profile Picture</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {user?.avatar && (
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-2 text-white text-xs">
                      ✓
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                    className="w-full text-xs sm:text-sm text-gray-400 cursor-pointer
                      file:mr-3 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-xs sm:file:text-sm file:font-semibold
                      file:bg-purple-600 file:text-white
                      hover:file:bg-purple-700 file:transition file:cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="pt-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-3">Cover Image</label>
              <div className="space-y-3">
                {user?.coverImage && (
                  <img
                    src={user.coverImage}
                    alt="Cover"
                    className="w-full h-20 sm:h-28 object-cover rounded-lg border border-gray-600"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files[0])}
                  className="w-full text-xs sm:text-sm text-gray-400 cursor-pointer
                    file:mr-3 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-xs sm:file:text-sm file:font-semibold
                    file:bg-purple-600 file:text-white
                    hover:file:bg-purple-700 file:transition file:cursor-pointer"
                />
                <p className="text-xs text-gray-500">JPG, PNG (Max 10MB)</p>
              </div>
            </div>

            {/* Update Button */}
            <button
              onClick={handleProfileSubmit}
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
            >
              {isLoading ? "Updating..." : "Save Profile Changes"}
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-purple-400 mb-6">Change Password</h2>

          <div className="space-y-4 sm:space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password (must include uppercase, lowercase, number & symbol)"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className={`w-full px-3 sm:px-4 py-2 text-sm rounded-lg bg-gray-700 border text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition ${
                  newPassword && passwordError
                    ? "border-red-500 focus:border-red-500"
                    : newPassword && !passwordError
                    ? "border-green-500 focus:border-green-500"
                    : "border-gray-600 focus:border-purple-500"
                }`}
              />
              {newPassword && (
                <div className="mt-2">
                  {passwordError ? (
                    <div className="text-red-400 text-xs space-y-1">
                      <p className="font-semibold">Password must contain:</p>
                      {validatePassword(newPassword).map((error, idx) => (
                        <p key={idx}>❌ {error}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-green-400 text-xs">
                      <p>✅ Password is strong!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>

            {/* Change Password Button */}
            <button
              onClick={handlePasswordSubmit}
              disabled={isLoading || !isPasswordValid()}
              className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
            >
              {isLoading ? "Updating..." : "Change Password"}
            </button>

            {/* Security Tip */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mt-4">
              <p className="text-xs sm:text-sm text-gray-400">
                🔒 <span className="text-gray-300 font-medium">Security Tip:</span> Use a strong password with numbers and special characters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
