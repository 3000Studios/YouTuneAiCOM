import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const CommandHistory = ({ commands }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new commands are added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [commands]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-neon-green" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-neon-blue animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Terminal className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status, type) => {
    if (type === 'system') return 'text-neon-green';
    
    switch (status) {
      case 'success':
        return 'text-neon-green';
      case 'processing':
        return 'text-neon-blue';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-panel p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-neon-blue flex items-center">
          <Terminal className="w-5 h-5 mr-2" />
          COMMAND LOG
        </h3>
        <div className="text-xs text-gray-400">
          {commands.length} entries
        </div>
      </div>

      {/* Command History */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-transparent"
      >
        <AnimatePresence>
          {commands.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No commands executed yet</p>
              <p className="text-xs mt-2">Use the controls to issue commands</p>
            </div>
          ) : (
            commands.map((command, index) => (
              <motion.div
                key={command.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-3 rounded-lg border transition-all ${
                  command.type === 'system' 
                    ? 'bg-neon-green/10 border-neon-green/30' 
                    : command.status === 'processing'
                    ? 'bg-neon-blue/10 border-neon-blue/30'
                    : command.status === 'success'
                    ? 'bg-neon-green/10 border-neon-green/30'
                    : 'bg-gray-800/50 border-gray-600/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(command.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-mono ${
                        command.type === 'system' ? 'text-neon-green' : 'text-neon-blue'
                      }`}>
                        {command.type === 'system' ? 'SYSTEM' : 'USER'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {command.timestamp}
                      </span>
                    </div>
                    
                    <p className={`text-sm break-words ${getStatusColor(command.status, command.type)}`}>
                      {command.text}
                    </p>
                    
                    {command.status === 'processing' && (
                      <div className="mt-2">
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 h-1 bg-neon-blue rounded-full"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Statistics */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-neon-green">
              {commands.filter(cmd => cmd.status === 'success').length}
            </div>
            <div className="text-xs text-gray-400">Success</div>
          </div>
          <div>
            <div className="text-lg font-bold text-neon-blue">
              {commands.filter(cmd => cmd.status === 'processing').length}
            </div>
            <div className="text-xs text-gray-400">Processing</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-400">
              {commands.filter(cmd => cmd.status === 'error').length}
            </div>
            <div className="text-xs text-gray-400">Errors</div>
          </div>
        </div>
      </div>

      {/* Clear History Button */}
      {commands.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-3 w-full py-2 text-xs bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-900/30 transition-all"
          onClick={() => {
            // This would be handled by parent component
            console.log('Clear history');
          }}
        >
          CLEAR HISTORY
        </motion.button>
      )}
    </motion.div>
  );
};

export default CommandHistory;