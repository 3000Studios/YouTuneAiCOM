import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  // Placeholder track data (matching manifest)
  const tracks = [
    {
      id: 'cyber-ambient-1',
      title: 'Cyber Ambient Atmosphere',
      artist: 'Unknown',
      duration: 240,
      genre: 'Ambient'
    },
    {
      id: 'tech-beats-1',
      title: 'Technological Rhythms',
      artist: 'Unknown',
      duration: 180,
      genre: 'Electronic'
    },
    {
      id: 'space-meditation-1',
      title: 'Space Meditation',
      artist: 'Unknown',
      duration: 300,
      genre: 'Ambient'
    },
    {
      id: 'synthwave-drive-1',
      title: 'Synthwave Drive',
      artist: 'Unknown',
      duration: 220,
      genre: 'Synthwave'
    },
    {
      id: 'neural-pulses-1',
      title: 'Neural Pulses',
      artist: 'Unknown',
      duration: 195,
      genre: 'Experimental'
    }
  ];

  const currentTrack = tracks[currentTrackIndex];

  // Auto-rotate tracks
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }, 30000); // 30 seconds for demo

    return () => clearInterval(interval);
  }, [tracks.length]);

  // Simulate progress
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextTrack();
            return 0;
          }
          return prev + (100 / currentTrack.duration);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel p-6"
    >
      <h3 className="text-lg font-bold text-neon-blue mb-4 flex items-center">
        <Volume2 className="w-5 h-5 mr-2" />
        AUDIO CONTROL
      </h3>

      {/* Track Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-white font-semibold text-sm truncate">
              {currentTrack.title}
            </h4>
            <p className="text-gray-400 text-xs">
              {currentTrack.artist} • {currentTrack.genre}
            </p>
          </div>
          <div className="text-xs text-gray-400">
            {formatTime((progress / 100) * currentTrack.duration)} / {formatTime(currentTrack.duration)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <motion.div
            className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-black hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </motion.button>

        <motion.button
          onClick={nextTrack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-neon-blue hover:bg-white/20 transition-all"
        >
          <SkipForward className="w-5 h-5" />
        </motion.button>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-neon-blue hover:text-white transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-16 h-1 bg-gray-700 rounded-full slider"
          />
        </div>
      </div>

      {/* Track List Preview */}
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setProgress(0);
            }}
            className={`w-full text-left px-2 py-1 rounded text-xs transition-all ${
              index === currentTrackIndex
                ? 'bg-neon-blue/20 text-neon-blue'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="truncate">{track.title}</div>
          </button>
        ))}
      </div>

      {/* Visualizer bars */}
      <div className="flex items-end justify-center space-x-1 mt-4 h-8">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 bg-gradient-to-t from-neon-blue to-neon-purple rounded-t"
            animate={{
              height: isPlaying 
                ? [`${Math.random() * 20 + 5}px`, `${Math.random() * 30 + 10}px`]
                : '5px'
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: isPlaying ? Infinity : 0,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default MusicPlayer;