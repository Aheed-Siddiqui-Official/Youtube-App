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
} from "../../store/slices/videoSlice.js";

const VideoPlayer = ({ video, user, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const subscriberCount = useSelector(
    (state) => state.videos.subscriberCounts?.[video.owner._id] || 0,
  );

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const dispatch = useDispatch();

  const { subscribedChannels } = useSelector((state) => state.videos);
  const { user: currentUser } = useSelector((state) => state.auth);

  const isSubscribed = subscribedChannels?.includes(video.owner._id);

  const { likedVideos } = useSelector((state) => state.videos);
  const isLiked = likedVideos.some((v) => v._id === video._id);

  useEffect(() => {
    dispatch(fetchSubscriberCount(video.owner._id));
  }, [video.owner._id, subscribedChannels]);

  const handleSubscribe = async () => {
    if (currentUser._id === video.owner._id)
      return alert("You cannot subscribe to yourself");

    await dispatch(toggleSubscription(video.owner._id));
  };

  const handleLikeClick = async () => {
    await dispatch(toggleLike(video._id)).unwrap();
    // refresh liked videos
    dispatch(fetchLikedVideos());
  };

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle progress bar change
  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle speed change
  const handleSpeedChange = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Handle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all"
      >
        <X size={24} className="text-white" />
      </button>

      {/* Video Player Container */}
      <div className="w-full bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Video Player */}
          <div className="relative w-full bg-black aspect-video rounded-lg overflow-hidden group">
            <video
              ref={videoRef}
              src={video.videoFile}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full"
            />

            {/* Player Controls */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Progress Bar */}
              <div className="px-4 pb-3 space-y-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="px-4 pb-4 flex items-center justify-between gap-4">
                {/* Left Controls */}
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="hover:scale-110 transition-transform text-white"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={toggleMute}
                      className="hover:scale-110 transition-transform text-white"
                    >
                      <Volume2 size={20} />
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-20 transition-all h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>

                  {/* Time Display */}
                  <span className="text-sm text-gray-300 ml-2">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">
                  {/* Speed Control */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      className="hover:bg-white/20 px-3 py-1 rounded text-white text-sm transition-all"
                    >
                      {playbackSpeed}x
                    </button>
                    {showSpeedMenu && (
                      <div className="absolute bottom-full right-0 bg-gray-900 rounded-lg p-2 space-y-1 mb-2 border border-gray-700">
                        {speedOptions.map((speed) => (
                          <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`block w-full text-left px-3 py-1 rounded transition-all ${
                              playbackSpeed === speed
                                ? "bg-red-600 text-white"
                                : "text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Settings */}
                  <button className="hover:bg-white/20 p-2 rounded transition-all text-white">
                    <Settings size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Play Button Overlay (when not hovering) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center group-hover:hidden">
                <button
                  onClick={togglePlay}
                  className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-all transform hover:scale-110"
                >
                  <Play size={32} className="text-white fill-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
          {video.title}
        </h1>

        {/* Channel and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-700">
          {/* Channel Info */}
          <div className="flex items-center gap-4">
            <img
              src={video.owner?.avatar || "https://via.placeholder.com/48"}
              alt={video.owner?.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-semibold">
                {video.owner?.username}
              </p>
              {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""}
            </div>
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                isSubscribed
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isLiked
                  ? "bg-red-600 text-white"
                  : "bg-gray-800/50 text-white hover:bg-gray-700"
              }`}
            >
              <ThumbsUp size={20} />
              <span className="text-sm">{isLiked ? "Liked" : "Like"}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 hover:bg-gray-700 text-white transition-all">
              <Share2 size={20} />
              <span className="text-sm">Share</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 hover:bg-gray-700 text-white transition-all">
              <Bookmark size={20} />
              <span className="text-sm">Save</span>
            </button>
          </div>
        </div>

        {/* Video Stats and Description */}
        <div className="mt-6 space-y-4">
          {/* Stats */}
          <div className="text-gray-400 text-sm">
            <span className="font-semibold text-white">{video.views || 0}</span>{" "}
            views •{" "}
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Description */}
          <div className="bg-gray-900/50 rounded-lg p-4 max-h-32 overflow-y-auto">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
