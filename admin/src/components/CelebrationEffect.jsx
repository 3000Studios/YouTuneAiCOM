import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CelebrationEffect = ({ onComplete }) => {
  const [showExplosion, setShowExplosion] = useState(true);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    // Explosion sound effect (simulated)
    console.log('🔊 EXPLOSION SOUND EFFECT');
    
    // Sequence the celebration effects
    const timer1 = setTimeout(() => {
      setShowModel(true);
    }, 500);

    const timer2 = setTimeout(() => {
      setShowExplosion(false);
    }, 1500);

    const timer3 = setTimeout(() => {
      setShowModel(false);
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      {/* Explosion Effect */}
      {showExplosion && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Multiple explosion rings */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 border-4 rounded-full"
              style={{
                borderColor: ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#00ffff'][i],
                width: 100 + i * 100,
                height: 100 + i * 100,
                marginLeft: -(50 + i * 50),
                marginTop: -(50 + i * 50),
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 2, 4], 
                opacity: [1, 0.5, 0]
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Particle explosion */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#8000ff'][Math.floor(Math.random() * 5)],
                left: '50%',
                top: '50%'
              }}
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: (Math.random() - 0.5) * 800,
                y: (Math.random() - 0.5) * 800,
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Flash effect */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.3, times: [0, 0.1, 1] }}
          />
        </div>
      )}

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-10 text-center"
      >
        <motion.h1
          className="text-6xl font-black mb-4 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green bg-clip-text text-transparent"
          animate={{ 
            scale: [1, 1.1, 1],
            textShadow: [
              '0 0 20px #ff00ff',
              '0 0 40px #00ffff', 
              '0 0 20px #ff00ff'
            ]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          HELL YEAH!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-2xl text-neon-blue font-bold"
        >
          COMMAND EXECUTED SUCCESSFULLY!
        </motion.p>
      </motion.div>

      {/* Bikini Model Animation (Placeholder) */}
      {showModel && (
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 200 }}
          transition={{ duration: 0.8 }}
          className="absolute right-10 bottom-10"
        >
          <div className="w-32 h-48 bg-gradient-to-b from-pink-400 via-purple-500 to-blue-500 rounded-lg shadow-2xl shadow-pink-500/50 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-2"
              >
                💃
              </motion.div>
              <p className="text-white text-xs font-bold">CELEBRATION!</p>
            </div>
          </div>
          
          {/* Sparkles around the model */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300 text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 360],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                repeatDelay: 1
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Fireworks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 40}%`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{
              duration: 2,
              delay: 0.5 + Math.random() * 1,
              ease: "easeOut"
            }}
          >
            {/* Firework burst */}
            {[...Array(8)].map((_, j) => (
              <motion.div
                key={j}
                className="absolute w-1 h-8 bg-gradient-to-t from-yellow-400 to-red-500 origin-bottom"
                style={{
                  transform: `rotate(${j * 45}deg)`,
                }}
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ 
                  scaleY: [0, 1, 0.5], 
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 1,
                  delay: 0.8 + Math.random() * 0.5
                }}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Sound effect text */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="text-4xl font-black text-red-500 animate-pulse">
          💥 BOOM! 💥
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CelebrationEffect;