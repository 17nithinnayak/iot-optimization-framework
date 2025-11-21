"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D ESP32 Chip Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 15, 0, -15, 0],
          }}
          transition={{
            rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ESP32 Chip Visual */}
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            {/* Chip Body */}
            <div className="absolute inset-0 glass glow-border rounded-lg">
              <div className="absolute inset-4 bg-gradient-to-br from-[#00f3ff]/20 to-[#bd00ff]/20 rounded" />
              
              {/* Chip Details */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-[#00f3ff] font-bold text-2xl md:text-4xl font-mono glow-text">
                  ESP32
                </div>
                <div className="text-[#bd00ff] text-xs md:text-sm mt-2 opacity-70">
                  QUANTUM-READY
                </div>
              </div>
              
              {/* Chip Pins */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={`pin-l-${i}`} className="w-4 h-1 bg-[#00f3ff] opacity-50" />
                ))}
              </div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={`pin-r-${i}`} className="w-4 h-1 bg-[#00f3ff] opacity-50" />
                ))}
              </div>
            </div>
            
            {/* Scanning Effect */}
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-full h-8 bg-gradient-to-b from-transparent via-[#00f3ff]/30 to-transparent"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#00f3ff] glow-text">IMMORTALITY</span>
          <br />
          <span className="text-white">FOR THE EDGE</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AI-Driven Battery Optimization & Post-Quantum Security for the IoT World
        </motion.p>

        {/* CTA Button */}
        <motion.button
          className="relative group px-12 py-5 text-lg font-bold overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Microchip Shape */}
          <div className="absolute inset-0 glass glow-border rounded-lg glitch">
            <div className="absolute inset-2 bg-gradient-to-r from-[#00f3ff]/20 to-[#bd00ff]/20" />
            
            {/* Chip Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00f3ff]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00f3ff]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00f3ff]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00f3ff]" />
          </div>
          
          <span className="relative z-10 text-[#00f3ff] group-hover:text-white transition-colors">
            INITIALIZE SYSTEM
          </span>
          
          {/* Hover Glitch Lines */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="absolute top-1/4 left-0 w-full h-px bg-[#ff2a2a] transform -translate-x-full group-hover:translate-x-full transition-transform duration-300" />
            <div className="absolute top-3/4 left-0 w-full h-px bg-[#00f3ff] transform translate-x-full group-hover:-translate-x-full transition-transform duration-300" />
          </div>
        </motion.button>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-[#00f3ff] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
}