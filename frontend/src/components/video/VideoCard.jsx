import React from "react";
import { MoreVertical } from "lucide-react";

const VideoCard = ({
  thumbnail,
  duration,
  avatarUrl,
  title,
  channelName,
  views,
  uploadTime,
  onMenuClick,
}) => {
  // Format duration from seconds to minutes
  const formatDuration = (sec) => {
    if (!sec || isNaN(sec)) return "0m";
    const minutes = Math.round(sec / 60);
    return `${minutes}m`;
  };

  return (
    <div className="cursor-pointer group">
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900 mb-3">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* Duration Badge - Only show on small screens */}
        <div className="absolute bottom-2 right-2 sm:hidden bg-black/80 text-white text-xs px-2 py-1 rounded font-semibold">
          {formatDuration(duration)}
        </div>
      </div>

      {/* Video Info */}
      <div className="flex gap-3">
        {/* Channel Avatar */}
        <div className="flex-shrink-0">
          <img
            src={avatarUrl}
            alt={channelName}
            className="w-9 h-9 rounded-full object-cover"
          />
        </div>

        {/* Video Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-sm font-normal line-clamp-2 mb-1.5 leading-snug">
            {title}
          </h3>
          <p className="text-gray-400 text-xs">{channelName}</p>
          <div className="flex items-center justify-between gap-1">
            <p className="text-gray-400 text-xs">
              {views} • {uploadTime}
            </p>
            {onMenuClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMenuClick();
                }}
                className="text-gray-400 hover:text-white transition-colors ml-auto flex-shrink-0 cursor-pointer"
              >
                <MoreVertical size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
