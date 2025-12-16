"use client";

import React from "react";
import { colors, colorArray } from "./GDGColors";

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
const FallingSnowParticle = ({ delay, duration, left, size }: { 
  delay: number; 
  duration: number; 
  left: number; 
  size: number;
}) => (
  <div
    className="absolute rounded-full bg-white"
    style={{
      width: size,
      height: size,
      left: `${left}%`,
      top: -20,
      opacity: 0.6 + Math.random() * 0.4,
      animation: `snowfall ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.5)`,
    }}
  />
);

export default function FloatingShapes() {
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
            transform: translateY(100vh) translateX(${Math.random() > 0.5 ? '' : '-'}30px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Falling Snow Particles */}
      {[...Array(30)].map((_, i) => (
        <FallingSnowParticle
          key={`falling-snow-${i}`}
          delay={Math.random() * 10}
          duration={8 + Math.random() * 8}
          left={Math.random() * 100}
          size={2 + Math.random() * 4}
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
      {[...Array(8)].map((_, i) => (
        <Snowflake
          key={`snow-${i}`}
          size={Math.random() * 20 + 15}
          color={colors.white}
          style={{
            opacity: 0.4 + Math.random() * 0.3,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 4}s ease-in-out infinite, twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      {/* Christmas Ornaments */}
      {[...Array(5)].map((_, i) => {
        const ornamentColors = [colors.red, colors.green, colors.gold];
        return (
          <Ornament
            key={`ornament-${i}`}
            size={Math.random() * 25 + 20}
            color={ornamentColors[i % ornamentColors.length]}
            style={{
              opacity: 0.3 + Math.random() * 0.2,
              top: `${10 + Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        );
      })}

      {/* Golden Stars */}
      {[...Array(6)].map((_, i) => (
        <Star
          key={`star-${i}`}
          size={Math.random() * 15 + 10}
          color={colors.gold}
          style={{
            opacity: 0.4 + Math.random() * 0.3,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Small twinkling dots - like Christmas lights */}
      {[...Array(16)].map((_, i) => {
        const lightColors = [colors.red, colors.green, colors.gold, colors.white];
        return (
          <div
            key={`light-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 4 + "px",
              height: Math.random() * 8 + 4 + "px",
              background: lightColors[i % 4],
              opacity: 0.5 + Math.random() * 0.3,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${1.5 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: `0 0 ${8 + Math.random() * 8}px ${lightColors[i % 4]}`,
            }}
          />
        );
      })}
    </div>
  );
}
