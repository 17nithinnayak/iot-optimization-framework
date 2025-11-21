"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Lock, Zap, CheckCircle } from "lucide-react";

export default function LiveMetrics() {
  const [powerReduction, setPowerReduction] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // Animated counter
  useEffect(() => {
    const timer = setInterval(() => {
      setPowerReduction((prev) => {
        if (prev < 97) return prev + 1;
        return 97;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  // Lock animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLocked(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Terminal typewriter effect
  useEffect(() => {
    const lines = [
      "> Initializing Cerberus Framework...",
      "> Loading ML models... OK",
      "> Kyber-512 encryption enabled",
      "> Anomaly detection: ACTIVE",
      "> Battery optimization: ENGAGED",
      "> System status: OPERATIONAL",
    ];

    let currentLine = 0;
    const timer = setInterval(() => {
      if (currentLine < lines.length) {
        setTerminalLines((prev) => [...prev, lines[currentLine]]);
        currentLine++;
      }
    }, 800);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#bd00ff] glow-text mb-4"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            LIVE METRICS
          </h2>
          <p className="text-gray-400 text-lg">Real-time system performance</p>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Power Reduction */}
          <motion.div
            className="glass glow-border rounded-xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Zap className="w-12 h-12 text-[#00f3ff] mx-auto mb-4" />
            <div className="text-6xl font-bold text-[#00f3ff] glow-text mb-2">
              {powerReduction}%
            </div>
            <div className="text-gray-400 uppercase tracking-wider text-sm">
              Power Reduction
            </div>
          </motion.div>

          {/* Kyber-512 Encrypted */}
          <motion.div
            className="glass glow-border rounded-xl p-8 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              animate={{
                scale: isLocked ? [1, 1.2, 1] : 1,
                rotate: isLocked ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Lock
                className={`w-12 h-12 mx-auto mb-4 ${
                  isLocked ? "text-[#00ff41]" : "text-[#ff2a2a]"
                }`}
              />
            </motion.div>
            <div
              className={`text-3xl font-bold mb-2 ${
                isLocked ? "text-[#00ff41]" : "text-[#ff2a2a]"
              }`}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              KYBER-512
            </div>
            <div className="text-gray-400 uppercase tracking-wider text-sm">
              {isLocked ? "Encrypted" : "Encrypting..."}
            </div>

            {/* Lock Animation Overlay */}
            {isLocked && (
              <motion.div
                className="absolute inset-0 bg-[#00ff41]/10"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            )}
          </motion.div>

          {/* Legacy Supported */}
          <motion.div
            className="glass glow-border rounded-xl p-8 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <CheckCircle className="w-12 h-12 text-[#bd00ff] mx-auto mb-4" />
            </motion.div>
            <div
              className="text-3xl font-bold text-[#bd00ff] mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              LEGACY
            </div>
            <div className="text-gray-400 uppercase tracking-wider text-sm">
              Fully Supported
            </div>

            {/* Retro-to-Modern Transition */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#888888] via-[#bd00ff] to-[#00f3ff]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.6 }}
            />
          </motion.div>
        </div>

        {/* Terminal Section */}
        <motion.div
          className="glass glow-border rounded-xl p-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#00f3ff]/20">
            <div className="w-3 h-3 rounded-full bg-[#ff2a2a]" />
            <div className="w-3 h-3 rounded-full bg-[#ffaa00]" />
            <div className="w-3 h-3 rounded-full bg-[#00ff41]" />
            <span className="ml-4 text-[#00f3ff] text-sm font-mono">
              cerberus@edge:~$
            </span>
          </div>

          {/* Terminal Content */}
          <div className="space-y-2 font-mono text-sm">
            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                className="text-[#00ff41]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {line}
              </motion.div>
            ))}
            
            {/* Blinking Cursor */}
            {terminalLines.length > 0 && (
              <motion.span
                className="inline-block w-2 h-4 bg-[#00f3ff] ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}