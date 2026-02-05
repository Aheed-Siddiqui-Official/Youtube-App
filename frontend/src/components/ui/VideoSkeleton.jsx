import Skeleton from "./Skeleton";

const VideoSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-lg">
          {/* Thumbnail Skeleton */}
          <div className="relative overflow-hidden rounded-lg">
            <Skeleton width="100%" height="180px" style={{ borderRadius: "12px" }} />
          </div>
          
          {/* Video Info Skeleton */}
          <div className="px-0 py-2 space-y-3">
            <div className="flex gap-3 items-start">
              {/* Avatar Skeleton */}
              <div className="flex-shrink-0 mt-1">
                <Skeleton width="36px" height="36px" style={{ borderRadius: "50%" }} />
              </div>
              
              {/* Content Skeleton */}
              <div className="flex-1 space-y-2.5 w-full">
                {/* Title - Two lines */}
                <div className="space-y-1.5">
                  <Skeleton width="100%" height="14px" />
                  <Skeleton width="85%" height="14px" />
                </div>
                
                {/* Channel Name */}
                <Skeleton width="55%" height="12px" style={{ marginTop: "8px" }} />
                
                {/* Views and Date */}
                <Skeleton width="65%" height="12px" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoSkeleton;
