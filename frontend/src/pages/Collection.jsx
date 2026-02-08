import React from "react";
import { Clock, Sparkles, ArrowRight } from "lucide-react";

const Collection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center space-y-10 py-16">
        {/* Decorative elements */}
        <div className="relative mx-auto w-32 h-32 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-full p-8 border border-purple-500/30 shadow-2xl">
            <Clock size={64} className="text-purple-400" />
            <Sparkles
              size={24}
              className="absolute -top-2 -right-2 text-yellow-400 animate-pulse"
            />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Collections
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
          Your personal video collections
        </p>

        {/* Coming soon badge + message */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-full border border-purple-500/30 backdrop-blur-sm">
          <span className="text-lg font-semibold text-purple-300">
            Coming Soon
          </span>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        </div>

        {/* Teaser / progress hint */}
        <div className="pt-8">
          <p className="text-gray-500 text-sm sm:text-base">
            Expected release:{" "}
            <span className="text-purple-400 font-medium">
              Will be announced
            </span>
          </p>
        </div>

        {/* Small footer note */}
        <p className="text-gray-600 text-sm pt-12">
          Thank you for your patience — something awesome is coming!
        </p>
      </div>
    </div>
  );
};

export default Collection;
