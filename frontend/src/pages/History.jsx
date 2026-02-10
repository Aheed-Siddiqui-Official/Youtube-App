import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/video/VideoCard";
import VideoPlayer from "../components/video/VideoPlayer";
import { fetchWatchHistory } from "../store/slices/authSlice.js";

const History = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { watchHistory, watchHistoryStatus: status } = useSelector(
    (state) => state.auth
  );
  const { user: currentUser, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const videoIdFromUrl = searchParams.get("v");
  const selectedVideo =
    watchHistory.find((v) => v._id === videoIdFromUrl) || null;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWatchHistory());
    }
  }, [dispatch, isAuthenticated]);

  const handleVideoClick = (video) => {
    setSearchParams({ v: video._id });
  };

  const handleClosePlayer = () => {
    setSearchParams({});
  };

  // ── Not logged in message ───────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-black to-amber-950 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
            No Watch History Yet
          </h2>
          <p className="text-xl text-gray-300">
            Please sign in to see your watch history
          </p>
          <p className="text-gray-500">
            Videos you watch will appear here so you can easily come back to them later.
          </p>
          <button className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg shadow-amber-900/30">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-black to-amber-950 text-white flex items-center justify-center">
        <p className="text-xl text-gray-300">Loading watch history...</p>
      </div>
    );
  }

  if (watchHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-black to-amber-950 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-300">
            No Watch History Yet
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Videos you watch will appear here so you can easily come back to them later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-black to-amber-950 text-white px-4 sm:px-6 md:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
        Watch History
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {watchHistory.map((video) => (
          <div
            key={video._id}
            onClick={() => handleVideoClick(video)}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-gray-900 border border-gray-800 hover:border-amber-500/40"
          >
            <img
              src={video.thumbnail || "https://via.placeholder.com/320x180"}
              alt={video.title}
              className="w-full h-52 object-cover rounded-t-2xl"
            />

            <div className="p-4">
              <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-amber-300 transition">
                {video.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1 truncate">
                {video.owner?.username || "Unknown"}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {video.views?.toLocaleString() || 0} views •{" "}
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          user={currentUser}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default History;