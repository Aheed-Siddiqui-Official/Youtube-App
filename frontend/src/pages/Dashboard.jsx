import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VideoGrid from "../components/video/VideoGrid.jsx";

const videoData = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    duration: "1:22",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    title:
      "Dhanda Nyoliwala - Russian Bandana (Music Video) | Deepesh Goyal | VYRL Haryanvi",
    channelName: "ahmed007",
    views: "97 views",
    uploadTime: "11 months ago",
  },
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
    duration: "11:12",
    avatarUrl:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    title: "This AI is BETTER than ChatGPT ! *DeepSeek*",
    channelName: "ahmed007",
    views: "30 views",
    uploadTime: "11 months ago",
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop",
    duration: "0:03",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    title:
      "Lyrical: Ukka Hi Banana | 1920 Evil Returns | Arjit Singh | Aftab Shrivastav, Tia Bajpai",
    channelName: "ahmed007",
    views: "45 views",
    uploadTime: "11 months ago",
  },
  {
    id: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=450&fit=crop",
    duration: "0:03",
    avatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
    title:
      "LAJAWAAB - TAIMOUR BAIG | Prod. Dizla Beats (Official Lyrical Video)",
    channelName: "ahmed007",
    views: "80 views",
    uploadTime: "11 months ago",
  },
  {
    id: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=450&fit=crop",
    duration: "0:00",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    title:
      "BONITA (VIDEO SONG): @YoYoHoneySingh | @TheShamsHere | GLORY | BHUSHAN...",
    channelName: "farhad007",
    views: "125 views",
    uploadTime: "11 months ago",
  },
];

const Dashboard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("videos");

  /* ---------------- UNAUTHENTICATED VIEW ---------------- */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">You are not logged in</h1>
          <p className="text-gray-400">
            Login or create an account to view the dashboard
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- AUTHENTICATED VIEW ---------------- */

  const {
    coverImage,
    avatar,
    fullName,
    username,
    subscribersCount = 0,
    subscribedCount = 0,
    videos = [],
  } = user || {};

  const tabClass = (tab) =>
    `pb-3 whitespace-nowrap ${
      activeTab === tab
        ? "text-purple-400 border-b-2 border-purple-400"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cover */}
      <div className="h-40 sm:h-56 w-full">
        <img
          src={coverImage || "https://via.placeholder.com/1500x400"}
          className="h-full w-full object-cover"
          alt="cover"
        />
      </div>

      {/* Profile */}
      <div className="max-w-7xl mx-auto px-4 -mt-16">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={avatar || "https://via.placeholder.com/150"}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-black object-cover"
              alt="avatar"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{fullName}</h1>
              <p className="text-gray-400">@{username}</p>
              <p className="text-sm text-gray-400">
                {subscribersCount} Subscribers · {subscribedCount} Subscribed
              </p>
            </div>
          </div>

          <button className="bg-purple-500 text-black px-5 py-2 rounded font-semibold h-15 mt-10 hover:bg-purple-400">
            + Follow
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mt-8 border-b border-gray-700 overflow-x-auto">
          <button
            className={tabClass("videos")}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
          <button
            className={tabClass("playlist")}
            onClick={() => setActiveTab("playlist")}
          >
            Playlist
          </button>
          <button
            className={tabClass("tweets")}
            onClick={() => setActiveTab("tweets")}
          >
            Tweets
          </button>
          <button
            className={tabClass("following")}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
        </div>

        {/* Content
        <div className="mt-6 pb-12">
          {activeTab === "videos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center">
                  No videos uploaded yet
                  <div className="px-6 py-6">
                    <VideoGrid videos={videoData} />
                  </div>
                </p>
              ) : (
                videos.map((video) => (
                  <div
                    key={video._id}
                    className="bg-gray-900 rounded overflow-hidden"
                  >
                    <img
                      src={video.thumbnail}
                      className="w-full h-40 object-cover"
                      alt={video.title}
                    />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div> */}

         <VideoGrid videos={videoData} />
      </div>
    </div>
  );
};

export default Dashboard;
