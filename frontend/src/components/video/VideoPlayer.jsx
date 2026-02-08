import { useRef, useState, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  Settings,
  ThumbsUp,
  Share2,
  Bookmark,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLikedVideos,
  fetchSubscriberCount,
  toggleLike,
  toggleSubscription,
  fetchSingleVideo,
} from "../../store/slices/videoSlice.js";

const VideoPlayer = ({ video: initialVideo, user, onClose }) => {
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // ── Redux selectors ────────────────────────────────────────────────
  const { currentVideo, loading } = useSelector((state) => state.videos);
  const { subscribedChannels } = useSelector((state) => state.videos);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { likedVideos } = useSelector((state) => state.videos);

  const displayedVideo = currentVideo || initialVideo;

  const isSubscribed = subscribedChannels?.includes(displayedVideo?.owner?._id);
  const isLiked = likedVideos.some((v) => v._id === displayedVideo?._id);

  const subscriberCount =
    useSelector(
      (state) => state.videos.subscriberCounts?.[displayedVideo?.owner?._id],
    ) || 0;

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // ── Fetch fresh data when modal opens ───────────────────────────
  useEffect(() => {
    if (initialVideo?._id) {
      dispatch(fetchSingleVideo(initialVideo._id));
      dispatch(fetchSubscriberCount(initialVideo.owner?._id));
    }

    // Reset player state when video changes
    return () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [dispatch, initialVideo?._id, initialVideo?.owner?._id]);

  const handleSubscribe = async () => {
    if (currentUser?._id === displayedVideo?.owner?._id) {
      alert("You cannot subscribe to yourself");
      return;
    }
    await dispatch(toggleSubscription(displayedVideo.owner._id));
  };

  const handleLikeClick = async () => {
    if (!displayedVideo?._id) return;

    try {
      await dispatch(toggleLike(displayedVideo._id)).unwrap();
      // Refresh liked videos list to keep isLiked accurate
      dispatch(fetchLikedVideos());
    } catch (err) {
      console.error("Like toggle failed:", err);
      alert("Failed to update like. Please try again.");
    }
  };

  // ── Video controls ─────────────────────────────────────────────
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSpeedChange = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "0:00";
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    if (h > 0)
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!displayedVideo) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-xl">Loading video...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 rounded-full p-3 transition-all"
      >
        <X size={28} className="text-white" />
      </button>

      {/* Video Container */}
      <div className="w-full bg-black">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="relative w-full bg-black aspect-video rounded-xl overflow-hidden group shadow-2xl">
            <video
              ref={videoRef}
              src={displayedVideo.videoFile}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-contain"
              playsInline
            />

            {/* Overlay Controls */}
            <div
              className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                ${loading ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`}
            >
              {/* Progress Bar */}
              <div className="px-4 pb-4 sm:pb-6 space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  step="any"
                  onChange={handleProgressChange}
                  className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer accent-red-600"
                  disabled={loading}
                />
                <div className="flex justify-between text-xs sm:text-sm text-gray-300 px-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="px-4 pb-5 sm:pb-6 flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center gap-3 sm:gap-5">
                  <button
                    onClick={togglePlay}
                    disabled={loading}
                    className="text-white hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                  </button>

                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={toggleMute}
                      disabled={loading}
                      className="text-white hover:scale-110 transition-transform disabled:opacity-50"
                    >
                      <Volume2 size={22} />
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-28 sm:w-32 transition-all h-1.5 bg-gray-600 rounded-full cursor-pointer accent-red-600"
                      disabled={loading}
                    />
                  </div>

                  <span className="hidden sm:block text-sm text-gray-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      className="px-2 py-1.5 text-sm text-white hover:bg-white/10 rounded transition-all"
                      disabled={loading}
                    >
                      {playbackSpeed}x
                    </button>

                    {showSpeedMenu && (
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[80px]">
                        {speedOptions.map((speed) => (
                          <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`w-full text-left px-4 py-1.5 text-sm transition-colors ${
                              playbackSpeed === speed
                                ? "bg-red-600 text-white"
                                : "text-gray-200 hover:bg-gray-800"
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
                    disabled={loading}
                  >
                    <Settings size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Big Play Button when paused */}
            {!isPlaying && !loading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                <button
                  onClick={togglePlay}
                  className="pointer-events-auto bg-red-600/90 hover:bg-red-700 p-6 rounded-full transform transition-all hover:scale-110 shadow-2xl"
                >
                  <Play size={40} className="text-white fill-white" />
                </button>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 line-clamp-2">
          {loading ? "Loading..." : displayedVideo.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-gray-700">
          {/* Channel Info */}
          <div className="flex items-center gap-4">
            <img
              src={
                displayedVideo.owner?.avatar || "https://via.placeholder.com/48"
              }
              alt={displayedVideo.owner?.username}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-gray-700"
            />
            <div>
              <p className="font-semibold text-lg">
                {displayedVideo.owner?.username}
              </p>
              <p className="text-gray-400 text-sm">
                {loading ? "..." : subscriberCount.toLocaleString()} subscriber
                {subscriberCount !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={`ml-3 px-5 sm:px-6 py-2 rounded-full font-medium transition-all text-sm sm:text-base ${
                isSubscribed
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-red-600 hover:bg-red-700"
              } disabled:opacity-60`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleLikeClick}
              disabled={loading}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full transition-all text-sm sm:text-base ${
                isLiked
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-800/70 hover:bg-gray-700"
              } disabled:opacity-60`}
            >
              <ThumbsUp size={18} className={isLiked ? "fill-white" : ""} />
              <span className="font-medium">
                {displayedVideo.likesCount !== undefined
                  ? displayedVideo.likesCount.toLocaleString()
                  : "…"}
              </span>
            </button>

            <button className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-gray-800/70 hover:bg-gray-700 text-white transition-all text-sm sm:text-base">
              <Share2 size={18} /> Share
            </button>

            <button className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-gray-800/70 hover:bg-gray-700 text-white transition-all text-sm sm:text-base">
              <Bookmark size={18} /> Save
            </button>
          </div>
        </div>

        {/* Stats + Description */}
        <div className="mt-6 space-y-4">
          <div className="text-gray-400 text-sm">
            <span className="font-semibold text-white">
              {loading ? "•••" : (displayedVideo.views || 0).toLocaleString()}
            </span>{" "}
            views • {new Date(displayedVideo.createdAt).toLocaleDateString()}
          </div>

          <div className="bg-gray-900/60 rounded-xl p-5 max-h-48 overflow-y-auto text-sm leading-relaxed text-gray-200 whitespace-pre-wrap border border-gray-800">
            {loading
              ? "Loading description..."
              : displayedVideo.description || "No description provided."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
