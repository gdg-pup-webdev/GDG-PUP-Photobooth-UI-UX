"use client";

import React, { useState, useEffect } from "react";
import { colors } from "./GDGColors";

// Snowflake SVG component
const Snowflake = ({ size, color, style }: { size: number; color: string; style: React.CSSProperties }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={style}
    className="absolute"
  >
    <path d="M12 0L13.5 4.5L18 3L15 7.5L19.5 9L15 10.5L18 15L13.5 13.5L12 18L10.5 13.5L6 15L9 10.5L4.5 9L9 7.5L6 3L10.5 4.5L12 0Z" />
    <circle cx="12" cy="12" r="2" fill={color} opacity="0.5" />
  </svg>
);

// Christmas Ornament SVG component
const Ornament = ({ size, color, style }: { size: number; color: string; style: React.CSSProperties }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={style}
    className="absolute"
  >
    <rect x="10" y="0" width="4" height="4" fill={colors.gold} rx="1" />
    <circle cx="12" cy="14" r="10" fill={color} />
    <ellipse cx="12" cy="14" rx="8" ry="8" fill={color} opacity="0.8" />
    <ellipse cx="9" cy="11" rx="2" ry="3" fill="white" opacity="0.3" />
  </svg>
);

// Star SVG component
const Star = ({ size, color, style }: { size: number; color: string; style: React.CSSProperties }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={style}
    className="absolute"
  >
    <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" />
  </svg>
);

// Falling Snow Particle component
const FallingSnowParticle = ({ delay, duration, left, size, opacity }: {
  delay: number;
  duration: number;
  left: number;
  size: number;
  opacity: number;
}) => (
  <div
    className="absolute rounded-full bg-white"
    style={{
      width: size,
      height: size,
      left: `${left}%`,
      top: -20,
      opacity,
      animation: `snowfall ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.5)`,
    }}
  />
);

export default function FloatingShapes() {
  const [mounted, setMounted] = useState(false);

  // Generate random values only on client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server to avoid hydration mismatch
  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }

  // Generate random values (only runs on client now)
  const snowParticles = [...Array(30)].map(() => ({
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 8,
    left: Math.random() * 100,
    size: 2 + Math.random() * 4,
    opacity: 0.6 + Math.random() * 0.4,
  }));

  const snowflakes = [...Array(8)].map(() => ({
    size: Math.random() * 20 + 15,
    opacity: 0.4 + Math.random() * 0.3,
    top: Math.random() * 100,
    left: Math.random() * 100,
    floatDuration: 4 + Math.random() * 4,
    twinkleDuration: 2 + Math.random() * 3,
    delay: Math.random() * 3,
    rotation: Math.random() * 360,
  }));

  const ornaments = [...Array(5)].map((_, i) => ({
    size: Math.random() * 25 + 20,
    colorIdx: i % 3,
    opacity: 0.3 + Math.random() * 0.2,
    top: 10 + Math.random() * 80,
    left: Math.random() * 100,
    duration: 5 + Math.random() * 3,
    delay: Math.random() * 2,
  }));

  const stars = [...Array(6)].map(() => ({
    size: Math.random() * 15 + 10,
    opacity: 0.4 + Math.random() * 0.3,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 2,
  }));

  const lights = [...Array(16)].map((_, i) => ({
    width: Math.random() * 8 + 4,
    height: Math.random() * 8 + 4,
    colorIdx: i % 4,
    opacity: 0.5 + Math.random() * 0.3,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: 1.5 + Math.random() * 2,
    delay: Math.random() * 2,
    glowSize: 8 + Math.random() * 8,
  }));

  const ornamentColors = [colors.red, colors.green, colors.gold];
  const lightColors = [colors.red, colors.green, colors.gold, colors.white];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* CSS for snowfall animation */}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(30px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Falling Snow Particles */}
      {snowParticles.map((particle, i) => (
        <FallingSnowParticle
          key={`falling-snow-${i}`}
          delay={particle.delay}
          duration={particle.duration}
          left={particle.left}
          size={particle.size}
          opacity={particle.opacity}
        />
      ))}

      {/* Large glowing circles - Christmas themed */}
      <div
        className="absolute w-72 h-72 rounded-full opacity-25 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${colors.red}60, transparent)`,
          top: "-8%",
          right: "-5%",
          animation: "float 8s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute w-56 h-56 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${colors.green}60, transparent)`,
          bottom: "5%",
          left: "-5%",
          animation: "float 6s ease-in-out infinite reverse",
          filter: "blur(30px)",
        }}
      />
      <div
        className="absolute w-40 h-40 rounded-full opacity-25"
        style={{
          background: `radial-gradient(circle, ${colors.gold}50, transparent)`,
          top: "50%",
          right: "8%",
          animation: "float 7s ease-in-out infinite",
          filter: "blur(25px)",
        }}
      />

      {/* Floating Snowflakes */}
      {snowflakes.map((flake, i) => (
        <Snowflake
          key={`snow-${i}`}
          size={flake.size}
          color={colors.white}
          style={{
            opacity: flake.opacity,
            top: `${flake.top}%`,
            left: `${flake.left}%`,
            animation: `float ${flake.floatDuration}s ease-in-out infinite, twinkle ${flake.twinkleDuration}s ease-in-out infinite`,
            animationDelay: `${flake.delay}s`,
            transform: `rotate(${flake.rotation}deg)`,
          }}
        />
      ))}

      {/* Christmas Ornaments */}
      {ornaments.map((ornament, i) => (
        <Ornament
          key={`ornament-${i}`}
          size={ornament.size}
          color={ornamentColors[ornament.colorIdx]}
          style={{
            opacity: ornament.opacity,
            top: `${ornament.top}%`,
            left: `${ornament.left}%`,
            animation: `float ${ornament.duration}s ease-in-out infinite`,
            animationDelay: `${ornament.delay}s`,
          }}
        />
      ))}

      {/* Golden Stars */}
      {stars.map((star, i) => (
        <Star
          key={`star-${i}`}
          size={star.size}
          color={colors.gold}
          style={{
            opacity: star.opacity,
            top: `${star.top}%`,
            left: `${star.left}%`,
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Small twinkling dots - like Christmas lights */}
      {lights.map((light, i) => (
        <div
          key={`light-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${light.width}px`,
            height: `${light.height}px`,
            background: lightColors[light.colorIdx],
            opacity: light.opacity,
            top: `${light.top}%`,
            left: `${light.left}%`,
            animation: `twinkle ${light.duration}s ease-in-out infinite`,
            animationDelay: `${light.delay}s`,
            boxShadow: `0 0 ${light.glowSize}px ${lightColors[light.colorIdx]}`,
          }}
        />
      ))}
    </div>
  );
}
