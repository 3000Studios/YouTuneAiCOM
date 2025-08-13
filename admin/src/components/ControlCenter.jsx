import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoWallpaper from './VideoWallpaper';
import MusicPlayer from './MusicPlayer';
import CommandControls from './CommandControls';
import CommandHistory from './CommandHistory';
import CelebrationEffect from './CelebrationEffect';

const ControlCenter = () => {
  const [commands, setCommands] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const addCommand = (command, type = 'user') => {
    const newCommand = {
      id: Date.now(),
      text: command,
      type,
      timestamp: new Date().toLocaleTimeString(),
      status: type === 'user' ? 'processing' : 'success'
    };
    
    setCommands(prev => [...prev, newCommand]);
    
    // Simulate command processing
    if (type === 'user') {
      setTimeout(() => {
        setCommands(prev => 
          prev.map(cmd => 
            cmd.id === newCommand.id 
              ? { ...cmd, status: 'success' }
              : cmd
          )
        );
        
        // Add system response
        setTimeout(() => {
          addCommand(`Command "${command}" executed successfully`, 'system');
        }, 500);
      }, 1000);
    }
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Video Wallpaper Background */}
      <VideoWallpaper />
      
      {/* Main Control Interface */}
      <div className="relative z-10 w-full h-full p-6 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-bold neon-text">
              ADMIN CONTROL CENTER
            </h1>
            <p className="text-gray-400 mt-2">
              YouTuneAI Command Interface v3.0 - Status: ONLINE
            </p>
          </div>
          
          <div className="glass-panel px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-neon-green text-sm font-mono">
                SYSTEM OPERATIONAL
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Music & Status */}
          <div className="space-y-6">
            <MusicPlayer />
            
            {/* System Status Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-6"
            >
              <h3 className="text-lg font-bold text-neon-blue mb-4">SYSTEM STATUS</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">CPU Usage</span>
                  <span className="text-neon-green">23%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Memory</span>
                  <span className="text-neon-green">4.2GB / 16GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span className="text-neon-green">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Status</span>
                  <span className="text-neon-green">Active</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Column - Command Controls */}
          <div className="space-y-6">
            <CommandControls 
              onCommand={addCommand}
              onCelebration={triggerCelebration}
            />
          </div>

          {/* Right Column - Command History */}
          <div>
            <CommandHistory commands={commands} />
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-600">
            CLASSIFIED SYSTEM - AUTHORIZED PERSONNEL ONLY
          </p>
        </motion.div>
      </div>

      {/* Celebration Effect Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <CelebrationEffect onComplete={() => setShowCelebration(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ControlCenter;