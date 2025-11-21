"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Code2, Cpu } from "lucide-react";

export default function DigitalTwinDemo() {
  const [mode, setMode] = useState<"eco" | "security">("eco");

  const accentColor = mode === "eco" ? "#00ff41" : "#ff2a2a";

  const codeSnippet = `// ESP32 Cerberus Integration
#include <cerberus.h>

void setup() {
  Cerberus.init();
  Cerberus.setMode(${mode === "eco" ? "ECO_MODE" : "SECURITY_MODE"});
  
  // Enable ML optimization
  Cerberus.enableMLPrediction();
  
  // Activate Kyber-512
  Cerberus.enableQuantumSafe();
}

void loop() {
  Cerberus.monitor();
  
  if (Cerberus.detectAnomaly()) {
    Cerberus.blockThreat();
  }
  
  delay(100);
}`;

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
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: accentColor,
              textShadow: `0 0 20px ${accentColor}`,
            }}
          >
            DIGITAL TWIN
          </h2>
          <p className="text-gray-400 text-lg">
            Real-time simulation & visualization
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass glow-border rounded-full p-2 flex items-center gap-2">
            <button
              className={`px-8 py-3 rounded-full transition-all duration-300 ${
                mode === "eco"
                  ? "bg-[#00ff41]/20 text-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.5)]"
                  : "text-gray-400"
              }`}
              onClick={() => setMode("eco")}
            >
              <span className="font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                ECO MODE
              </span>
            </button>
            <button
              className={`px-8 py-3 rounded-full transition-all duration-300 ${
                mode === "security"
                  ? "bg-[#ff2a2a]/20 text-[#ff2a2a] shadow-[0_0_20px_rgba(255,42,42,0.5)]"
                  : "text-gray-400"
              }`}
              onClick={() => setMode("security")}
            >
              <span className="font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                SECURITY MODE
              </span>
            </button>
          </div>
        </motion.div>

        {/* Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Raw Code */}
          <motion.div
            className="glass glow-border rounded-xl p-6 overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <Code2 className="w-6 h-6 text-[#00f3ff]" />
              <h3
                className="text-xl font-bold text-[#00f3ff]"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                REAL WORLD
              </h3>
            </div>

            <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
              <code>{codeSnippet}</code>
            </pre>
          </motion.div>

          {/* Right Side - 3D Visualization */}
          <motion.div
            className="glass glow-border rounded-xl p-6 overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <Cpu className="w-6 h-6" style={{ color: accentColor }} />
              <h3
                className="text-xl font-bold"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: accentColor,
                }}
              >
                3D VISUALIZATION
              </h3>
            </div>

            {/* Visualization Content */}
            <div className="relative h-96 flex items-center justify-center">
              {/* Network Graph Visualization */}
              <motion.div
                className="relative w-full h-full"
                animate={{
                  filter: mode === "eco" ? "hue-rotate(0deg)" : "hue-rotate(240deg)",
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Central Node */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <div
                    className="w-24 h-24 rounded-full glass flex items-center justify-center"
                    style={{
                      borderColor: accentColor,
                      borderWidth: "2px",
                      boxShadow: `0 0 30px ${accentColor}`,
                    }}
                  >
                    <Cpu className="w-12 h-12" style={{ color: accentColor }} />
                  </div>
                </motion.div>

                {/* Orbiting Nodes */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const angle = (i * 60 * Math.PI) / 180;
                  const radius = 120;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        x: x - 12,
                        y: y - 12,
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{
                          backgroundColor: accentColor,
                          boxShadow: `0 0 10px ${accentColor}`,
                        }}
                      />
                      {/* Connection Line */}
                      <svg
                        className="absolute top-1/2 left-1/2"
                        style={{
                          width: radius * 2,
                          height: radius * 2,
                          transform: "translate(-50%, -50%)",
                          pointerEvents: "none",
                        }}
                      >
                        <line
                          x1={radius}
                          y1={radius}
                          x2={radius + x}
                          y2={radius + y}
                          stroke={accentColor}
                          strokeWidth="1"
                          opacity="0.3"
                        />
                      </svg>
                    </motion.div>
                  );
                })}

                {/* Data Packets */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`packet-${i}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: accentColor,
                      top: "50%",
                      left: "50%",
                    }}
                    animate={{
                      x: [0, Math.cos((i * 45 * Math.PI) / 180) * 150],
                      y: [0, Math.sin((i * 45 * Math.PI) / 180) * 150],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.25,
                    }}
                  />
                ))}
              </motion.div>

              {/* Mode Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="glass rounded-full px-6 py-2">
                  <span
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: accentColor }}
                  >
                    {mode === "eco" ? "⚡ Power Optimized" : "🛡️ Security Hardened"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-24 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <div className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse" />
            <span className="font-mono">Powered by Raspberry Pi & Scikit-Learn</span>
          </div>
          <div className="mt-4 text-xs text-gray-600">
            Project Cerberus © 2024 - Post-Quantum IoT Security Framework
          </div>
        </motion.footer>
      </div>
    </section>
  );
}