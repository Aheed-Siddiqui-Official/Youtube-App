import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlaylists,
  createPlaylist,
  deletePlaylist,
  fetchSinglePlaylist,
  clearSinglePlaylist,
} from "../store/slices/playlistSlice";
import VideoCard from "../components/video/VideoCard";
import { X } from "lucide-react";

const Playlists = () => {
  const dispatch = useDispatch();
  const {
    playlists = [],
    singlePlaylist,
    loading,
    error,
  } = useSelector((state) => state.playlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  // Always fetch on mount - safe because backend is protected
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPlaylists());
    }
  }, [dispatch, isAuthenticated, window.location.pathname]); // force on route change

  const handleCreate = async () => {
    if (!playlistName.trim()) return alert("Playlist name is required");

    const newPlaylistData = {
      name: playlistName.trim(),
      description: description.trim() || "No description provided",
    };

    try {
      const result = await dispatch(createPlaylist(newPlaylistData)).unwrap();

      // Optimistic update: add to local state immediately (prevents flash of empty)
      // This is temporary - fetchPlaylists() will sync soon
      // But it feels instant and prevents "disappears" feel
      // Note: You can skip this if you prefer pure server sync
    } catch (err) {
      alert("Failed to create: " + (err.message || "Unknown error"));
    }

    setPlaylistName("");
    setDescription("");
    setShowCreateForm(false);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePlaylist(id)).unwrap();
    } catch (err) {
      alert("Failed to delete");
    }
    setDeleteConfirmId(null);
  };

  const handleViewPlaylist = (id) => {
    dispatch(fetchSinglePlaylist(id));
    setSelectedPlaylistId(id);
  };

  const handleClosePlaylistModal = () => {
    dispatch(clearSinglePlaylist());
    setSelectedPlaylistId(null);
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-950 via-black to-cyan-950 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            No Playlists Yet
          </h2>
          <p className="text-xl text-gray-300">
            Please sign in to see your playlists
          </p>
          <p className="text-gray-500">
            Create and manage your video collections here.
          </p>
          <button className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-950 via-black to-cyan-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading your playlists...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-950 via-black to-cyan-950 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-red-400">
            Something went wrong
          </h2>
          <p className="text-xl text-gray-300">{error}</p>
          <button
            onClick={() => dispatch(fetchPlaylists())}
            className="mt-4 px-8 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-full font-medium transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-950 via-black to-cyan-950 text-white px-4 sm:px-6 md:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
        My Playlists
      </h1>

      {/* Create Button */}
      <button
        onClick={() => setShowCreateForm(true)}
        className="mb-8 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-full font-medium transition-all shadow-md"
      >
        Create New Playlist
      </button>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">
              New Playlist
            </h2>

            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Playlist name *"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white mb-4 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none"
              required
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Playlist description (optional)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white mb-6 min-h-[120px] resize-y focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none"
            />

            <div className="flex gap-4">
              <button
                onClick={handleCreate}
                disabled={!playlistName.trim() || loading}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  playlistName.trim() && !loading
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-md"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? "Creating..." : "Create"}
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlists Grid */}
      {playlists.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">
            No playlists yet. Create your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-cyan-500/50"
            >
              <h3 className="text-xl font-bold mb-2 text-cyan-300">
                {playlist.name || "Unnamed Playlist"}
              </h3>
              <p className="text-gray-400 mb-4">
                {playlist.videos?.length || 0} videos
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleViewPlaylist(playlist._id)}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 py-2.5 rounded-lg text-sm font-medium transition-all"
                >
                  View
                </button>
                <button
                  onClick={() => setDeleteConfirmId(playlist._id)}
                  className="flex-1 bg-red-600/80 hover:bg-red-700 py-2.5 rounded-lg text-sm font-medium transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 text-center">
            <h2 className="text-2xl font-bold text-cyan-300 mb-6">
              Delete Playlist?
            </h2>
            <p className="text-gray-300 mb-8">
              This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Playlist View Modal */}
      {selectedPlaylistId && singlePlaylist && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-cyan-300">
                {singlePlaylist.name || "Unnamed Playlist"}
              </h2>
              <button
                onClick={handleClosePlaylistModal}
                className="text-gray-400 hover:text-cyan-300 transition"
              >
                <X size={32} />
              </button>
            </div>

            <p className="text-gray-400 mb-8 text-lg">
              {singlePlaylist.videos?.length || 0} videos
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {singlePlaylist.videos?.length > 0 ? (
                singlePlaylist.videos.map((video) => (
                  <VideoCard
                    key={video._id}
                    thumbnail={video.thumbnail}
                    title={video.title}
                    channelName={video.owner?.username}
                    views={video.views}
                    uploadTime={new Date(video.createdAt).toLocaleDateString()}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-400 py-12 text-lg">
                  No videos in this playlist yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;
