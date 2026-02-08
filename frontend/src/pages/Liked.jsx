import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/video/VideoCard";
import VideoPlayer from "../components/video/VideoPlayer";
import { fetchLikedVideos, toggleLike } from "../store/slices/videoSlice.js";

const Liked = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { likedVideos, status } = useSelector((state) => state.videos);
  const { user: currentUser } = useSelector((state) => state.auth);

  const videoIdFromUrl = searchParams.get("v");
  const selectedVideo =
    likedVideos.find((v) => v._id === videoIdFromUrl) || null;

  useEffect(() => {
    dispatch(fetchLikedVideos());
  }, [dispatch]);

  const handleVideoClick = (video) => {
    setSearchParams({ v: video._id });
  };

  const handleClosePlayer = () => {
    setSearchParams({});
  };

  const handleDislikeClick = async (e, videoId) => {
    e.stopPropagation();
    if (!currentUser) {
      alert("Please log in to unlike videos!");
      return;
    }
    await dispatch(toggleLike(videoId)).unwrap();
    dispatch(fetchLikedVideos());
  };

  if (status === "loading") {
    return (
      <p className="text-center text-gray-400 mt-20">Loading liked videos...</p>
    );
  }

  if (likedVideos.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-20">
        You haven't liked any videos yet!
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white px-4 sm:px-6 md:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Liked Videos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {likedVideos.map((video) => (
          <div
            key={video._id}
            onClick={() => handleVideoClick(video)}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-gray-900"
          >
            <img
              src={video.thumbnail || "https://via.placeholder.com/320x180"}
              alt={video.title}
              className="w-full h-52 object-cover rounded-t-2xl"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={(e) => handleDislikeClick(e, video._id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-105"
              >
                ♥ Dislike
              </button>
            </div>

            <div className="p-4">
              <h3 className="text-white font-semibold text-lg line-clamp-2 hover:text-red-400 transition">
                {video.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1 truncate">
                {video.owner?.username}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {video.views || 0} views •{" "}
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

export default Liked;
