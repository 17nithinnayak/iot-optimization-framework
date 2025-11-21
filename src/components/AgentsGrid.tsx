"use client";

import { motion } from "framer-motion";
import { Eye, Battery, Network } from "lucide-react";
import { useState } from "react";

const agents = [
  {
    id: 1,
    title: "The Sentinel",
    icon: Eye,
    color: "#ff2a2a",
    description: "Anomaly Detection. Blocks hacks instantly.",
    bgGradient: "from-[#ff2a2a]/20 to-[#ff2a2a]/5",
  },
  {
    id: 2,
    title: "The Analyst",
    icon: Battery,
    color: "#00f3ff",
    description: "Physics-ML Prediction. 38x Battery Life.",
    bgGradient: "from-[#00f3ff]/20 to-[#00f3ff]/5",
  },
  {
    id: 3,
    title: "The Governor",
    icon: Network,
    color: "#bd00ff",
    description: "Policy Engine. Balances Risk vs. Power.",
    bgGradient: "from-[#bd00ff]/20 to-[#bd00ff]/5",
  },
];

export default function AgentsGrid() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#00f3ff] glow-text mb-4"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            THE AGENTS
          </h2>
          <p className="text-gray-400 text-lg">
            Three autonomous systems working in harmony
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            const isHovered = hoveredCard === agent.id;

            return (
              <motion.div
                key={agent.id}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onMouseEnter={() => setHoveredCard(agent.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card */}
                <motion.div
                  className={`relative h-96 glass glow-border rounded-xl overflow-hidden cursor-pointer tilt-card`}
                  animate={{
                    rotateY: isHovered ? 8 : 0,
                    rotateX: isHovered ? 5 : 0,
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${agent.bgGradient} opacity-50`}
                  />

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                    {/* Icon Container */}
                    <motion.div
                      className="relative mb-8"
                      animate={{
                        rotate: isHovered ? 360 : 0,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Glowing Circle */}
                      <div
                        className="absolute inset-0 rounded-full blur-xl opacity-50"
                        style={{
                          backgroundColor: agent.color,
                          width: "120px",
                          height: "120px",
                        }}
                      />
                      
                      {/* Icon */}
                      <div
                        className="relative w-24 h-24 rounded-full flex items-center justify-center glass"
                        style={{
                          borderColor: agent.color,
                          borderWidth: "2px",
                        }}
                      >
                        <Icon
                          className="w-12 h-12"
                          style={{ color: agent.color }}
                        />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3
                      className="text-2xl font-bold mb-4"
                      style={{
                        color: agent.color,
                        fontFamily: "'Orbitron', sans-serif",
                      }}
                    >
                      {agent.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {agent.description}
                    </p>

                    {/* Status Indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: agent.color }}
                        animate={{
                          opacity: [1, 0.3, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div
                    className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 opacity-50"
                    style={{ borderColor: agent.color }}
                  />
                  <div
                    className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 opacity-50"
                    style={{ borderColor: agent.color }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 opacity-50"
                    style={{ borderColor: agent.color }}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-50"
                    style={{ borderColor: agent.color }}
                  />

                  {/* Hover Scan Line */}
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-full h-1"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)`,
                        }}
                        animate={{
                          y: ["0%", "100%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Holographic Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl blur-xl transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}