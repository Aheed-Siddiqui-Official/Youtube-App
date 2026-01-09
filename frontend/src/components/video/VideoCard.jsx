import React from "react";

const VideoCard = ({
  thumbnail,
  duration,
  avatarUrl,
  title,
  channelName,
  views,
  uploadTime,
}) => {
  return (
    <div className="cursor-pointer group">
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900 mb-3">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
          {duration}
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
          <p className="text-gray-400 text-xs">
            {views} • {uploadTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
