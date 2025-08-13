import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Keyboard, Zap, Send } from 'lucide-react';

const CommandControls = ({ onCommand, onCelebration }) => {
  const [isPushToTalk, setIsPushToTalk] = useState(false);
  const [isPushToType, setIsPushToType] = useState(false);
  const [commandText, setCommandText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textAreaRef = useRef(null);

  // Voice commands simulation
  const startListening = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      const voiceCommands = [
        'Initialize system diagnostics',
        'Activate neural network protocols',
        'Run security scan',
        'Execute maintenance routine',
        'Deploy AI assistant'
      ];
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      setCommandText(randomCommand);
      setIsListening(false);
      onCommand(randomCommand);
    }, 2000);
  };

  const handlePushToTalk = () => {
    if (!isPushToTalk) {
      setIsPushToTalk(true);
      startListening();
    } else {
      setIsPushToTalk(false);
      setIsListening(false);
    }
  };

  const handlePushToType = () => {
    setIsPushToType(!isPushToType);
    if (!isPushToType) {
      setTimeout(() => textAreaRef.current?.focus(), 100);
    }
  };

  const handleSendCommand = () => {
    if (commandText.trim()) {
      onCommand(commandText.trim());
      setCommandText('');
      setIsPushToType(false);
    }
  };

  const handleRunThatShit = () => {
    onCelebration();
    const epicCommands = [
      'MAXIMUM POWER OVERRIDE ENGAGED',
      'ALL SYSTEMS GO - FULL THROTTLE',
      'UNLEASHING DIGITAL FURY',
      'QUANTUM PROCESSORS ACTIVATED',
      'NEURAL NETWORKS AT 110% CAPACITY'
    ];
    const epicCommand = epicCommands[Math.floor(Math.random() * epicCommands.length)];
    onCommand(epicCommand);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Main Command Panel */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-bold text-neon-blue mb-6 text-center">
          COMMAND INTERFACE
        </h3>

        {/* Push to Talk */}
        <div className="mb-6">
          <motion.button
            onClick={handlePushToTalk}
            onMouseDown={() => setIsPushToTalk(true)}
            onMouseUp={() => {
              setIsPushToTalk(false);
              setIsListening(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              isPushToTalk || isListening
                ? 'border-neon-green bg-neon-green/20 shadow-lg shadow-neon-green/50'
                : 'border-neon-blue bg-neon-blue/10 hover:bg-neon-blue/20'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              {isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Mic className="w-6 h-6 text-neon-green" />
                </motion.div>
              ) : (
                <MicOff className="w-6 h-6 text-neon-blue" />
              )}
              <span className="font-bold">
                {isListening ? 'LISTENING...' : 'PUSH TO TALK'}
              </span>
            </div>
            {isListening && (
              <div className="mt-2">
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-8 bg-neon-green rounded"
                      animate={{
                        height: [8, 24, 8],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.button>
        </div>

        {/* Push to Type */}
        <div className="mb-6">
          <motion.button
            onClick={handlePushToType}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-3 rounded-lg border-2 transition-all ${
              isPushToType
                ? 'border-neon-purple bg-neon-purple/20 shadow-lg shadow-neon-purple/50'
                : 'border-neon-blue bg-neon-blue/10 hover:bg-neon-blue/20'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <Keyboard className="w-5 h-5 text-neon-blue" />
              <span className="font-bold">
                {isPushToType ? 'TYPE MODE ACTIVE' : 'PUSH TO TYPE'}
              </span>
            </div>
          </motion.button>

          {/* Command Input Area */}
          {isPushToType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <textarea
                ref={textAreaRef}
                value={commandText}
                onChange={(e) => setCommandText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSendCommand();
                  }
                }}
                placeholder="Enter command... (Ctrl+Enter to send)"
                className="w-full h-24 bg-black/50 border border-neon-blue/50 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  {commandText.length}/200 characters
                </span>
                <motion.button
                  onClick={handleSendCommand}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!commandText.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>SEND</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* The Epic Button */}
        <div className="text-center">
          <motion.button
            onClick={handleRunThatShit}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: "0 0 30px rgba(255, 0, 255, 0.8)" 
            }}
            whileTap={{ scale: 0.9 }}
            className="relative px-8 py-4 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-orange text-white font-black text-xl rounded-lg border-2 border-white shadow-lg overflow-hidden"
            style={{
              background: 'linear-gradient(45deg, #ff00ff, #8000ff, #ff8000)',
              animation: 'pulse-glow 2s infinite'
            }}
          >
            <div className="relative z-10 flex items-center space-x-3">
              <Zap className="w-6 h-6" />
              <span>RUN THAT SHIT!!</span>
              <Zap className="w-6 h-6" />
            </div>
            
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          </motion.button>
          
          <p className="text-xs text-gray-400 mt-2">
            WARNING: High energy command execution
          </p>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="glass-panel p-4">
        <h4 className="text-sm font-bold text-neon-blue mb-3">QUICK COMMANDS</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            'System Status',
            'Network Scan',
            'Data Backup',
            'AI Sync',
            'Security Check',
            'Performance Test'
          ].map((cmd) => (
            <motion.button
              key={cmd}
              onClick={() => onCommand(cmd)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 bg-white/5 border border-neon-blue/30 rounded text-xs hover:bg-neon-blue/20 hover:border-neon-blue transition-all"
            >
              {cmd}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CommandControls;