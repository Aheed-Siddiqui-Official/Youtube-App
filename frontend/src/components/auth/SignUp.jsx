import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, authActions } from "../../store/slices/authSlice.js";
import ToastContainer, { useToast } from "../ui/ToastContainer";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, successMessage } = useSelector((state) => state.auth);
  const { toasts, showToast, removeToast } = useToast();

  // Clear error/success on unmount
  useEffect(() => {
    return () => {
      dispatch(authActions.clearError());
      dispatch(authActions.clearSuccess());
    };
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      showToast(error, "error", 5000);
    }
  }, [error, showToast]);

  // Show success toast and redirect to login (NO auto-login)
  useEffect(() => {
    if (successMessage) {
      showToast(successMessage, "success", 4000);
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2500); // 2.5 seconds delay to let user see toast

      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate, showToast]);

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("One number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) errors.push("One special character");
    return errors;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (pwd) {
      const errors = validatePassword(pwd);
      setPasswordError(errors.length > 0 ? errors.join(", ") : "");
    } else {
      setPasswordError("");
    }
  };

  const isPasswordValid = () => password && validatePassword(password).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !fullName || !email || !password || !avatar || !coverImage) {
      showToast("All fields are required!", "error", 4000);
      return;
    }

    if (!isPasswordValid()) {
      showToast("Password does not meet security requirements", "error", 4000);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("coverImage", coverImage);

    // Dispatch signup – success/error handled via useEffect
    await dispatch(registerUser(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col overflow-hidden">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>

      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <a href="/" className="inline-block mb-6 transform hover:scale-105 transition">
              <img src="/Logo.png" alt="Logo" className="h-14 mx-auto drop-shadow-lg" />
            </a>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">Join our community and start creating</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                placeholder="Choose a unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition text-sm ${
                    password && passwordError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                      : password && !passwordError
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/50"
                      : "border-gray-600 focus:border-purple-500 focus:ring-purple-500/50"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.261l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
                      <path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.474 1.474A10.014 10.014 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .846 0 1.678-.105 2.488-.29l1.683 1.682a1 1 0 001.414-1.414z"></path>
                    </svg>
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  {passwordError ? (
                    <div className="text-red-400 text-xs space-y-1">
                      <p className="font-semibold">Password requirements:</p>
                      {validatePassword(password).map((error, idx) => (
                        <p key={idx}>❌ {error}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-green-400 text-xs font-semibold">
                      ✅ Password is strong!
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Profile Picture *</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="hidden"
                  id="avatar-input"
                  required
                />
                <label htmlFor="avatar-input" className="block w-full px-4 py-2.5 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-purple-500 hover:bg-gray-700 cursor-pointer transition text-sm text-center font-medium">
                  {avatar ? avatar.name : "Click to upload avatar"}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Cover Image *</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="hidden"
                  id="cover-input"
                  required
                />
                <label htmlFor="cover-input" className="block w-full px-4 py-2.5 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-purple-500 hover:bg-gray-700 cursor-pointer transition text-sm text-center font-medium">
                  {coverImage ? coverImage.name : "Click to upload cover image"}
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isPasswordValid()}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Already have an account?</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400">
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition">
                Sign in here
              </Link>
            </p>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;