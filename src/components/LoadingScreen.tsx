import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background Ripples */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/20"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: [0, 800, 1200],
              height: [0, 800, 1200],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Center Logo/Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-glow-primary">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-16 h-16 rounded-full border-4 border-transparent border-t-white"
            />
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
        >
          Metro Pools
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary mb-6"
        >
          Loading your pool management experience...
        </motion.p>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-card rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-text-muted mt-4"
        >
          {progress}%
        </motion.p>
      </div>

      {/* Water Effect Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-secondary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
