import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const VideoWallpaper = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  
  // Placeholder video data (matching manifest)
  const videos = [
    {
      id: 'space-nebula-1',
      title: 'Space Nebula Formation',
      fallbackGradient: 'from-purple-900 via-blue-900 to-indigo-900'
    },
    {
      id: 'abstract-waves-1',
      title: 'Abstract Digital Waves',
      fallbackGradient: 'from-cyan-900 via-blue-800 to-purple-900'
    },
    {
      id: 'particle-field-1',
      title: 'Particle Field Animation',
      fallbackGradient: 'from-green-900 via-teal-800 to-blue-900'
    },
    {
      id: 'geometric-shapes-1',
      title: 'Geometric Shapes Motion',
      fallbackGradient: 'from-orange-900 via-red-800 to-pink-900'
    },
    {
      id: 'neural-network-1',
      title: 'Neural Network Visualization',
      fallbackGradient: 'from-emerald-900 via-green-800 to-cyan-900'
    }
  ];

  useEffect(() => {
    // Rotate videos every 60 seconds
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 60000);

    return () => clearInterval(interval);
  }, [videos.length]);

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Animated gradient background as fallback */}
      <motion.div
        key={currentVideoIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className={`absolute inset-0 bg-gradient-to-br ${currentVideo.fallbackGradient} opacity-40`}
      />

      {/* Animated overlay effects */}
      <div className="absolute inset-0">
        {/* Particle effect overlay */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Pulsing energy rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 border border-neon-blue rounded-full"
            style={{
              width: 100 + i * 150,
              height: 100 + i * 150,
              marginLeft: -(50 + i * 75),
              marginTop: -(50 + i * 75),
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.1, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.3,
            }}
          />
        ))}
      </div>

      {/* Video title indicator */}
      <motion.div
        key={currentVideoIndex}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 1 }}
        className="absolute bottom-6 left-6 glass-panel px-4 py-2 rounded-lg"
      >
        <p className="text-sm text-neon-blue font-mono">
          WALLPAPER: {currentVideo.title.toUpperCase()}
        </p>
      </motion.div>

      {/* Video navigation dots */}
      <div className="absolute bottom-6 right-6 flex space-x-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideoIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentVideoIndex
                ? 'bg-neon-blue shadow-lg shadow-neon-blue/50'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Subtle film grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default VideoWallpaper;