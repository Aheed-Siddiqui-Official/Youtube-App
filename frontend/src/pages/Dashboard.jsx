import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/video/VideoCard.jsx";
import VideoPlayer from "../components/video/VideoPlayer.jsx";
import VideoSkeleton from "../components/ui/VideoSkeleton.jsx";
import {
  fetchMyVideos,
  uploadVideo,
  deleteVideo,
  updateVideo,
  fetchDashboardData,
} from "../store/slices/videoSlice.js";
import { Upload, Trash2, Settings, Play, MoreVertical } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { myVideos, loading } = useSelector((state) => state.videos);
  const { dashboard } = useSelector((state) => state.videos);

  const videoIdFromUrl = searchParams.get("v");
  const selectedVideo = myVideos.find((v) => v._id === videoIdFromUrl) || null;

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [updateModal, setUpdateModal] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [updateData, setUpdateData] = useState({
    title: "",
    description: "",
    videoFile: null,
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: true,
    video: null,
    thumbnail: null,
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyVideos());
      dispatch(fetchDashboardData());
    }
  }, [isAuthenticated, dispatch]);

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });
    await dispatch(uploadVideo(data)).unwrap();
    dispatch(fetchDashboardData());
    setShowUploadForm(false);
    setFormData({
      title: "",
      description: "",
      isPublic: true,
      video: null,
      thumbnail: null,
    });
  };

  const handleVideoClick = (video) => {
    setSearchParams({ v: video._id });
  };

  const handleClosePlayer = () => {
    setSearchParams({});
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            You are not logged in
          </h1>
          <p className="text-gray-400">
            Please sign in to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white">
      {/* Cover Image with Overlay */}
      <div className="w-full h-32 sm:h-40 md:h-56 lg:h-64 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 relative overflow-hidden group">
        {user.coverImage && (
          <img
            src={user.coverImage}
            alt="cover"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
      </div>

      {/* Channel Info Section */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-6 sm:pb-8">
        <div className="flex flex-col gap-4 sm:gap-6 -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-28 mb-6 sm:mb-8">
          {/* Avatar with Ring */}
          <div className="relative z-10 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            <img
              src={user.avatar || "https://via.placeholder.com/150"}
              alt={user.fullName}
              className="relative w-24 sm:w-28 md:w-32 lg:w-40 h-24 sm:h-28 md:h-32 lg:h-40 rounded-full border-4 border-black object-cover shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
            />
          </div>

          {/* Channel Details */}
          <div className="flex-1">
            <div className="mb-2 sm:mb-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                {user.fullName}
              </h1>
              <p className="text-sm text-purple-400 font-medium">
                @{user.username}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <span className="text-white font-bold text-lg">
                  {dashboard?.subscribersCount || 0}
                </span>
                <span className="text-gray-400">Subscribers</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></div>
              <div className="flex items-center gap-1">
                <span className="text-white font-bold text-lg">
                  {myVideos.length}
                </span>
                <span className="text-gray-400">
                  Video{myVideos.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-full font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Subscribe
            </button>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              {showUploadForm ? "Close" : "Upload"}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 mb-6 sm:mb-8">
          <form
            onSubmit={handleUpload}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl space-y-5 border border-gray-700/50 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Upload New Video
              </h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Video Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter a compelling video title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-sm rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Tell viewers what your video is about..."
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 text-sm rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 resize-none transition-all duration-300"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Video File *
                </label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 text-sm rounded-lg bg-gray-700/50 border-2 border-dashed border-gray-600/50 text-white cursor-pointer file:mr-3 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white hover:file:from-purple-700 hover:file:to-pink-700 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Thumbnail (Optional)
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 text-sm rounded-lg bg-gray-700/50 border-2 border-dashed border-gray-600/50 text-white cursor-pointer file:mr-3 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white hover:file:from-purple-700 hover:file:to-pink-700 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 text-base rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-lg"
              >
                Upload Video
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 px-6 py-3 text-base rounded-lg font-semibold text-white transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Videos Section */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-7 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Your Videos
          </h2>
          <span className="ml-auto text-sm text-gray-400 font-medium">
            {myVideos.length} video{myVideos.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <VideoSkeleton count={8} />
        ) : myVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-gradient-to-b from-gray-800/20 to-gray-900/20 rounded-2xl border border-gray-700/30">
            <Play size={48} className="text-purple-500 mb-4 opacity-50" />
            <p className="text-gray-300 text-lg font-medium mb-1">
              No videos uploaded yet
            </p>
            <p className="text-gray-500 text-sm">
              Create your first video to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {myVideos.map((video) => (
              <div
                key={video._id}
                className="relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                <VideoCard
                  thumbnail={video.thumbnail}
                  duration={video.duration || "0:00"}
                  avatarUrl={user.avatar}
                  title={video.title}
                  channelName={user.username}
                  views={video.views || "0 views"}
                  uploadTime={new Date(video.createdAt).toLocaleDateString()}
                  onMenuClick={() =>
                    setOpenMenuId(openMenuId === video._id ? null : video._id)
                  }
                />

                {/* Dropdown Menu */}
                {openMenuId === video._id && (
                  <div className="absolute bottom-20 right-0 bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-xl p-1 flex flex-col space-y-0 border border-gray-700/50 z-20 w-40">
                    <button
                      className="hover:bg-blue-500/20 text-left text-sm px-4 py-2 rounded hover:text-blue-400 transition flex items-center gap-2"
                      onClick={() => {
                        setUpdateModal(video._id);
                        setUpdateData({
                          title: video.title,
                          description: video.description,
                          videoFile: null,
                        });
                        setOpenMenuId(null);
                      }}
                    >
                      <Settings size={16} /> Update
                    </button>
                    <button
                      className="hover:bg-red-500/20 text-left text-sm px-4 py-2 rounded hover:text-red-400 transition flex items-center gap-2"
                      onClick={() => {
                        setDeleteModal(video._id);
                        setOpenMenuId(null);
                      }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-sm w-full border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-2">Delete Video?</h3>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded-lg text-white font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await dispatch(deleteVideo(deleteModal)).unwrap();
                  dispatch(fetchDashboardData());
                  setDeleteModal(null);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-lg text-white font-medium transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Video Modal */}
      {updateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-2xl w-full border border-gray-700/50 my-8">
            <h3 className="text-2xl font-bold text-white mb-6">Update Video</h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await dispatch(
                  updateVideo({
                    videoId: updateModal,
                    title: updateData.title,
                    description: updateData.description,
                    videoFile: updateData.videoFile,
                  }),
                );
                dispatch(fetchDashboardData());
                setUpdateModal(null);
              }}
              className="space-y-5"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  placeholder="Enter video title"
                  value={updateData.title}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 text-sm rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Tell viewers what your video is about..."
                  value={updateData.description}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  className="w-full px-4 py-3 text-sm rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 resize-none transition-all duration-300"
                  required
                />
              </div>

              {/* Video File (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Video File (Optional)
                </label>
                <input
                  type="file"
                  name="videoFile"
                  accept="video/*"
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      videoFile: e.target.files[0],
                    })
                  }
                  className="w-full px-4 py-3 text-sm rounded-lg bg-gray-700/50 border-2 border-dashed border-gray-600/50 text-white cursor-pointer file:mr-3 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-blue-700 file:text-white hover:file:from-blue-700 hover:file:to-blue-800 transition-all duration-300"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Leave empty to keep current video
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setUpdateModal(null)}
                  className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 px-4 py-3 rounded-lg text-white font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 px-4 py-3 rounded-lg text-white font-medium transition-all"
                >
                  {loading ? "Updating..." : "Update Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          user={user}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default Dashboard;
