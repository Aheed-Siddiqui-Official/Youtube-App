import React from "react";
import VideoCard from "./VideoCard";

const VideoGrid = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          thumbnail={video.thumbnail}
          duration={video.duration}
          avatarUrl={video.avatarUrl}
          title={video.title}
          channelName={video.channelName}
          views={video.views}
          uploadTime={video.uploadTime}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
