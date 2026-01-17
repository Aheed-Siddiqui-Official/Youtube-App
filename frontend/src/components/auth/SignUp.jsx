import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../store/slices/authSlice.js";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !fullName || !email || !password || !avatar || !coverImage) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("coverImage", coverImage);

    try {
      // Dispatch register thunk
      await dispatch(registerUser(formData)).unwrap();

      // If successful → redirect to login
      navigate("/login");
    } catch (err) {
      // Show backend error
      if (
        err.toLowerCase().includes("exists") ||
        err.toLowerCase().includes("email") ||
        err.toLowerCase().includes("username")
      ) {
        alert("User already exists with this email or username");
      } else {
        alert(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <form
          className="w-full max-w-md text-center space-y-6"
          onSubmit={handleSubmit}
        >
          <a href="/">
            <img src="/Logo.png" alt="Logo" className="h-12 mx-auto mb-4" />
          </a>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
          />

          <div className="text-left">
            <label className="block mb-1 text-gray-400">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded"
            />
          </div>

          <div className="text-left">
            <label className="block mb-1 text-gray-400">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-500 py-2 rounded font-semibold hover:bg-purple-400 transition"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-white underline">
              Log in
            </Link>
          </p>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </main>
    </div>
  );
};

export default Signup;
