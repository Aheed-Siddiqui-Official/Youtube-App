import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/video/VideoCard";
import VideoPlayer from "../components/video/VideoPlayer";
import VideoSkeleton from "../components/ui/VideoSkeleton";
import ToastContainer, { useToast } from "../components/ui/ToastContainer";
import { fetchAllVideos, resetAllVideos } from "../store/slices/videoSlice";
import { Sparkles, TrendingUp } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { allVideos, loading, loadingMore, hasMore, currentPage } = useSelector(
    (state) => state.videos
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { toasts, showToast, removeToast } = useToast();

  const videoIdFromUrl = searchParams.get("v");
  const selectedVideo = allVideos.find((v) => v._id === videoIdFromUrl) || null;

  const observerTarget = useRef(null);
  const previewRefs = useRef({}); // refs for hover video previews

  const handleVideoClick = (video) => {
    if (!isAuthenticated) {
      showToast("Please log in to watch videos", "warning", 5000);
      return;
    }
    setSearchParams({ v: video._id });
  };

  const handleClosePlayer = () => {
    setSearchParams({});
  };

  // Fetch initial videos
  useEffect(() => {
    dispatch(resetAllVideos());
    dispatch(fetchAllVideos({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Infinite scroll
  const handleObserverEntry = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
        dispatch(fetchAllVideos({ page: currentPage, limit: 10 }));
      }
    },
    [hasMore, loadingMore, loading, currentPage, dispatch]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserverEntry, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleObserverEntry]);

  // Hover preview with FULL VOLUME (only for non-logged-in users)
  const handleMouseEnter = (videoId, videoUrl) => {
    if (isAuthenticated || !videoUrl) return;

    const videoEl = previewRefs.current[videoId];
    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.volume = 1.0;          // Full volume
      videoEl.muted = false;         // Sound ON
      videoEl.loop = true;
      videoEl.play().catch((err) => {
        console.log("Autoplay blocked:", err);
        // Browsers may block unmuted autoplay until user interaction
      });
    }
  };

  const handleMouseLeave = (videoId) => {
    if (isAuthenticated) return;

    const videoEl = previewRefs.current[videoId];
    if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {/* Header Section */}
      <div className="relative px-4 sm:px-6 md:px-8 py-8 md:py-12 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-transparent rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-600/10 to-transparent rounded-full blur-3xl -z-10"></div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                  For You
                </h1>
              </div>
              <p className="text-gray-400 text-sm sm:text-base ml-10">
                Discover videos from creators worldwide
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-600/30 rounded-lg p-4 backdrop-blur-sm">
                <TrendingUp className="text-purple-400 mb-2" size={20} />
                <p className="text-xs text-gray-400">Trending Now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        {loading ? (
          <VideoSkeleton count={8} />
        ) : allVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Sparkles size={48} className="text-purple-500 mb-4 opacity-50" />
            <p className="text-gray-300 text-xl font-medium mb-2">
              No videos available
            </p>
            <p className="text-gray-500">Check back soon for new content</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {allVideos.map((video) => (
                <div
                  key={video._id}
                  className="relative group rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                  onMouseEnter={() => handleMouseEnter(video._id, video.videoFile)}
                  onMouseLeave={() => handleMouseLeave(video._id)}
                >
                  {/* Hover Preview Video - FULL VOLUME, full length */}
                  {!isAuthenticated && video.videoFile && (
                    <video
                      ref={(el) => (previewRefs.current[video._id] = el)}
                      src={video.videoFile}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      loop
                      playsInline
                    />
                  )}

                  {/* Thumbnail - hidden only on hover for non-logged-in */}
                  <div className={`${!isAuthenticated ? "group-hover:opacity-0" : ""} transition-opacity duration-300`}>
                    <VideoCard
                      thumbnail={video.thumbnail}
                      duration={video.duration || "0:00"}
                      avatarUrl={video.owner?.avatar}
                      title={video.title}
                      channelName={video.owner?.username}
                      views={`${video.views || 0} views`}
                      uploadTime={new Date(video.createdAt).toLocaleDateString()}
                    />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 rounded-xl"></div>
                </div>
              ))}
            </div>

            <div
              ref={observerTarget}
              className="flex justify-center py-12 md:py-16"
            >
              {loadingMore && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-3">
                    <svg
                      className="animate-spin h-12 w-12 text-purple-600"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Loading more videos...
                  </p>
                </div>
              )}

              {!hasMore && allVideos.length > 0 && (
                <div className="text-center">
                  <p className="text-gray-500 text-sm font-medium">
                    You've reached the end
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    No more videos to load
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {selectedVideo && isAuthenticated && (
          <VideoPlayer
            video={selectedVideo}
            user={user}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </div>
  );
};

export default Home;