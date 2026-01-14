import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../store/slices/authSlice";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const dispatch = useDispatch();

  const { isLoading, error, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !fullName || !email || !password || !avatar || !coverImage) {
      alert("All fields are required!");
      return;
    }

    if (user) {
      alert("User already exists!");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("coverImage", coverImage);

    dispatch(registerUser(formData));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <form
          className="w-full max-w-md text-center space-y-6"
          onSubmit={handleSubmit}
        >
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
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            required
            onChange={(e) => setFullname(e.target.value)}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Avatar with label */}
          <div className="text-left">
            <label className="block mb-1 text-gray-400" htmlFor="avatar">
              Avatar
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
              required
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </div>

          {/* Cover Image with label */}
          <div className="text-left">
            <label className="block mb-1 text-gray-400" htmlFor="coverImage">
              Cover Image
            </label>
            <input
              type="file"
              name="coverImage"
              id="coverImage"
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded focus:outline-none focus:border-purple-500"
              required
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-500 py-2 rounded font-semibold hover:bg-purple-400 transition"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>

          {/* Redirect to login */}
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-white underline">
              Log in
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Signup;
