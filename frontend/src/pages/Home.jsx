import VideoGrid from "../components/video/VideoGrid";

const Home = () => {
  const videoData = [
    {
      id: 1,
      thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      channelName: "frhad007",
      views: "125 views",
      uploadTime: "11 months ago",
    },
    {
      id: 6,
      thumbnail:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=450&fit=crop",
      duration: "0:00",
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      title:
        "BONITA (VIDEO SONG): @YoYoHoneySingh | @TheShamsHere | GLORY | BHUSHAN...",
      channelName: "frhad007",
      views: "125 views",
      uploadTime: "11 months ago",
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="px-6 py-6">
        <VideoGrid videos={videoData} />
      </div>
    </div>
  );
};

export default Home;
