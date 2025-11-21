"use client";

import HeroSection from "@/components/HeroSection";
import AgentsGrid from "@/components/AgentsGrid";
import LiveMetrics from "@/components/LiveMetrics";
import DigitalTwinDemo from "@/components/DigitalTwinDemo";
import ParallaxSection from "@/components/ParallaxSection";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section - No parallax for main hero */}
      <HeroSection />

      {/* Agents Grid with Parallax */}
      <ParallaxSection offset={100}>
        <AgentsGrid />
      </ParallaxSection>

      {/* Live Metrics with Parallax */}
      <ParallaxSection offset={80}>
        <LiveMetrics />
      </ParallaxSection>

      {/* Digital Twin Demo with Parallax */}
      <ParallaxSection offset={60}>
        <DigitalTwinDemo />
      </ParallaxSection>

      {/* Floating Stars Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}