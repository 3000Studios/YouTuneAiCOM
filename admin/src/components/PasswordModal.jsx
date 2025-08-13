import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Zap } from 'lucide-react';

const PasswordModal = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef(null);

  // Admin password (in production, this would be securely handled)
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      onAuthenticate(true);
    } else {
      setIsShaking(true);
      setAttempts(prev => prev + 1);
      setPassword('');
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center matrix-bg">
      {/* Matrix rain effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-neon-green text-xs opacity-30 animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            {Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join('')}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: isShaking ? [-10, 10, -10, 10, 0] : 0
        }}
        transition={{ 
          duration: 0.3,
          x: { duration: 0.6 }
        }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-panel p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Lock className="w-16 h-16 text-neon-blue mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-bold neon-text mb-2">
              ADMIN ACCESS
            </h1>
            <p className="text-gray-400">
              Enter authorization code to proceed
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-black/50 border border-neon-blue/50 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20 transition-all"
                placeholder="Enter access code..."
                maxLength={20}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-neon-blue transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full cyber-button flex items-center justify-center space-x-2"
              disabled={!password}
            >
              <Zap className="w-5 h-5" />
              <span>AUTHENTICATE</span>
            </motion.button>
          </form>

          {/* Attempts counter */}
          {attempts > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              <p className="text-red-400 text-sm">
                Failed attempts: {attempts}/5
              </p>
              {attempts >= 3 && (
                <p className="text-orange-400 text-xs mt-1">
                  Security protocols activating...
                </p>
              )}
            </motion.div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-600">
            <p>SECURE AUTHENTICATION SYSTEM v2.1</p>
            <p className="mt-1">© 3000Studios - YouTuneAI</p>
          </div>
        </div>
      </motion.div>

      {/* Background pulse effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5 animate-pulse" />
    </div>
  );
};

export default PasswordModal;