"use client";

/**
 * 🎭 SNAPCHAT-STYLE CHRISTMAS FILTERS
 * 
 * Real-time face filters using MediaPipe Face Mesh.
 * All effects are canvas-drawn for perfect transparency and smooth animation!
 */

import { useEffect, useRef, useState, useCallback } from "react";

// Define types for MediaPipe Face Mesh results
interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface FaceMeshResults {
  multiFaceLandmarks?: Landmark[][];
}

// Filter definitions
interface Filter {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const FILTERS: Filter[] = [
  { id: "none", name: "None", emoji: "❌", description: "No filter" },
  { id: "santa_hat", name: "Santa Hat", emoji: "🎅", description: "Classic Santa Hat" },
  { id: "mustache", name: "Mustache", emoji: "🥸", description: "Fluffy white mustache" },
  { id: "reindeer", name: "Reindeer", emoji: "🦌", description: "Rudolf with antlers" },
  { id: "elf", name: "Elf", emoji: "🧝", description: "Christmas elf ears" },
  { id: "santa_text", name: "Santa Text", emoji: "✨", description: "Curved event title" },
  { id: "snowflakes", name: "Snowflakes", emoji: "❄️", description: "Magical snow" },
  { id: "headband", name: "Headband", emoji: "🎀", description: "Antler headband" },
  { id: "debug_mesh", name: "Debug", emoji: "🔍", description: "View landmarks" },
];

// Snowflake state for animation
interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
}

interface FaceMeshDemoProps {
  onBack?: () => void;
}

export default function FaceMeshDemo({ onBack }: FaceMeshDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<string>("santa_hat");
  const [faceDetected, setFaceDetected] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Initialize snowflakes
  useEffect(() => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 50; i++) {
      flakes.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.002 + 0.001,
        opacity: Math.random() * 0.5 + 0.3,
        angle: Math.random() * Math.PI * 2,
      });
    }
    snowflakesRef.current = flakes;
  }, []);

  /**
   * 🎅 DRAW SANTA HAT
   * Draws a 2D Santa hat using canvas paths
   */
  const drawSantaHat = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
  ) => {
    const forehead = landmarks[10];
    const leftTemple = landmarks[127]; // Wider point
    const rightTemple = landmarks[356]; // Wider point
    
    // Calculate dimensions
    const hatWidth = Math.abs(rightTemple.x - leftTemple.x) * width * 1.4;
    const hatHeight = hatWidth * 1.1;
    
    // Center point for the hat base
    const centerX = forehead.x * width;
    const centerY = (forehead.y * height) - (hatHeight * 0.2); // Sit slightly above forehead
    
    // Rotation based on head tilt
    const angle = Math.atan2(
      rightTemple.y - leftTemple.y,
      rightTemple.x - leftTemple.x
    );

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.translate(-centerX, -centerY);

    //Shadows
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    // --- HAT BODY (Red Part) ---
    ctx.beginPath();
    ctx.fillStyle = "#D62828"; // Deep Santa Red
    
    // Simplified curved hat shape
    // Start at bottom left of hat body
    const baseLeftX = centerX - hatWidth * 0.4;
    const baseRightX = centerX + hatWidth * 0.4;
    const baseY = centerY - hatHeight * 0.1;

    ctx.moveTo(baseLeftX, baseY);
    
    // Curve up to the tip (drooping to the right)
    const tipX = centerX + hatWidth * 0.45;
    const tipY = centerY - hatHeight * 0.8;
    
    // Left curve
    ctx.bezierCurveTo(
      centerX - hatWidth * 0.4, centerY - hatHeight * 0.6, // Control point 1
      centerX, centerY - hatHeight * 0.9,                  // Control point 2
      tipX, tipY                                           // Tip
    );
    
    // Right curve (shorter, inner side of the droop)
    ctx.bezierCurveTo(
      centerX + hatWidth * 0.2, centerY - hatHeight * 0.7,
      centerX + hatWidth * 0.3, centerY - hatHeight * 0.5,
      baseRightX, baseY
    );
    
    ctx.fill();

    // Add gradient shading to the hat body
    const gradient = ctx.createLinearGradient(baseLeftX, baseY, tipX, tipY);
    gradient.addColorStop(0, "rgba(0,0,0,0.1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.1)");
    gradient.addColorStop(1, "rgba(0,0,0,0.2)");
    ctx.fillStyle = gradient;
    ctx.fill();

    // --- POMPOM (White Ball) ---
    const pompomRadius = hatWidth * 0.12;
    ctx.beginPath();
    ctx.arc(tipX, tipY, pompomRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    
    // Pompom texture/shading
    const pompomGrad = ctx.createRadialGradient(
      tipX - 5, tipY - 5, 2,
      tipX, tipY, pompomRadius
    );
    pompomGrad.addColorStop(0, "#FFFFFF");
    pompomGrad.addColorStop(1, "#E0E0E0");
    ctx.fillStyle = pompomGrad;
    ctx.fill();


    // --- FUR TRIM (White Band) ---
    ctx.beginPath();
    ctx.fillStyle = "#F8F9FA";
    
    // Draw a rounded rectangle-like shape for the trim
    const trimHeight = hatHeight * 0.25;
    const trimWidth = hatWidth * 1.0;
    const trimY = centerY - (trimHeight * 0.5);
    const trimX = centerX - (trimWidth * 0.5);

    // Use roundedRect-ish drawing for fluffiness
    ctx.moveTo(trimX + 20, trimY);
    ctx.lineTo(trimX + trimWidth - 20, trimY);
    ctx.quadraticCurveTo(trimX + trimWidth, trimY, trimX + trimWidth, trimY + 20);
    ctx.lineTo(trimX + trimWidth, trimY + trimHeight - 20);
    ctx.quadraticCurveTo(trimX + trimWidth, trimY + trimHeight, trimX + trimWidth - 20, trimY + trimHeight);
    ctx.lineTo(trimX + 20, trimY + trimHeight);
    ctx.quadraticCurveTo(trimX, trimY + trimHeight, trimX, trimY + trimHeight - 20);
    ctx.lineTo(trimX, trimY + 20);
    ctx.quadraticCurveTo(trimX, trimY, trimX + 20, trimY);
    ctx.fill();



    ctx.restore();
  }, []);

  /**
   * 🥸 DRAW MUSTACHE
   * Draws a fluffy white handlebar mustache
   */
  const drawMustache = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
  ) => {
    // Key landmarks for mustache positioning
    const noseTip = landmarks[1];
    const upperLipTop = landmarks[0]; // Center of upper lip
    const leftMouth = landmarks[61]; // Left corner of mouth
    const rightMouth = landmarks[291]; // Right corner of mouth
    const leftTemple = landmarks[71];
    const rightTemple = landmarks[301];
    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];

    const faceWidth = Math.abs((rightCheek.x - leftCheek.x) * width);

    // Calculate head rotation
    const angle = Math.atan2(
      (rightTemple.y - leftTemple.y) * height,
      (rightTemple.x - leftTemple.x) * width
    );

    // Position between nose and upper lip
    const centerX = upperLipTop.x * width;
    const centerY = ((noseTip.y + upperLipTop.y) / 2) * height;
    const mustacheWidth = faceWidth * 0.7;
    const mustacheHeight = faceWidth * 0.15;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    // ===== MAIN MUSTACHE BODY =====
    ctx.beginPath();
    
    // Left side of mustache
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-mustacheWidth * 0.2, -mustacheHeight * 0.8, -mustacheWidth * 0.5, -mustacheHeight * 0.3);
    ctx.quadraticCurveTo(-mustacheWidth * 0.6, mustacheHeight * 0.2, -mustacheWidth * 0.55, mustacheHeight * 0.5);
    ctx.quadraticCurveTo(-mustacheWidth * 0.3, mustacheHeight * 0.3, 0, mustacheHeight * 0.4);
    
    // Right side of mustache (mirror)
    ctx.quadraticCurveTo(mustacheWidth * 0.3, mustacheHeight * 0.3, mustacheWidth * 0.55, mustacheHeight * 0.5);
    ctx.quadraticCurveTo(mustacheWidth * 0.6, mustacheHeight * 0.2, mustacheWidth * 0.5, -mustacheHeight * 0.3);
    ctx.quadraticCurveTo(mustacheWidth * 0.2, -mustacheHeight * 0.8, 0, 0);
    
    ctx.closePath();

    // White gradient fill
    const gradient = ctx.createLinearGradient(0, -mustacheHeight, 0, mustacheHeight);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.5, "#f8f8f8");
    gradient.addColorStop(1, "#e8e8e8");
    ctx.fillStyle = gradient;
    ctx.fill();

    // Subtle shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    // ===== CURLY TIPS (Handlebar style) =====
    // Left curl
    ctx.beginPath();
    ctx.arc(-mustacheWidth * 0.55, mustacheHeight * 0.3, mustacheHeight * 0.35, 0, Math.PI, false);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Right curl
    ctx.beginPath();
    ctx.arc(mustacheWidth * 0.55, mustacheHeight * 0.3, mustacheHeight * 0.35, 0, Math.PI, false);
    ctx.fill();

    // ===== TEXTURE LINES =====
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(200, 200, 200, 0.4)";
    ctx.lineWidth = 1;
    
    // Draw hair texture lines
    for (let i = -4; i <= 4; i++) {
      const startX = i * (mustacheWidth * 0.1);
      ctx.beginPath();
      ctx.moveTo(startX, -mustacheHeight * 0.2);
      ctx.quadraticCurveTo(
        startX + (i < 0 ? -10 : 10),
        mustacheHeight * 0.1,
        startX + (i < 0 ? -15 : 15),
        mustacheHeight * 0.3
      );
      ctx.stroke();
    }

    // Center highlight
    ctx.beginPath();
    ctx.ellipse(0, 0, mustacheWidth * 0.08, mustacheHeight * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fill();

    ctx.restore();
  }, []);

  /**
   * 🦌 DRAW REINDEER
   * Rudolf nose + antlers
   */
  const drawReindeer = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
  ) => {
    const noseTip = landmarks[1];
    const forehead = landmarks[10];
    const chin = landmarks[152];
    const leftTemple = landmarks[71];
    const rightTemple = landmarks[301];
    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];

    const faceWidth = Math.abs((rightCheek.x - leftCheek.x) * width);
    const faceHeight = Math.abs((chin.y - forehead.y) * height);

    const angle = Math.atan2(
      (rightTemple.y - leftTemple.y) * height,
      (rightTemple.x - leftTemple.x) * width
    );

    // ===== RUDOLF NOSE =====
    const noseX = noseTip.x * width;
    const noseY = noseTip.y * height;
    const noseRadius = faceHeight * 0.1;

    // Outer glow
    const glowGradient = ctx.createRadialGradient(noseX, noseY, 0, noseX, noseY, noseRadius * 2.5);
    glowGradient.addColorStop(0, "rgba(255, 50, 50, 0.4)");
    glowGradient.addColorStop(0.5, "rgba(255, 0, 0, 0.15)");
    glowGradient.addColorStop(1, "rgba(255, 0, 0, 0)");
    ctx.beginPath();
    ctx.arc(noseX, noseY, noseRadius * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Main nose
    const mainGradient = ctx.createRadialGradient(
      noseX - noseRadius * 0.3, noseY - noseRadius * 0.3, 0,
      noseX, noseY, noseRadius
    );
    mainGradient.addColorStop(0, "#ff4444");
    mainGradient.addColorStop(0.3, "#ee0000");
    mainGradient.addColorStop(0.7, "#cc0000");
    mainGradient.addColorStop(1, "#880000");
    
    ctx.beginPath();
    ctx.arc(noseX, noseY, noseRadius, 0, Math.PI * 2);
    ctx.fillStyle = mainGradient;
    ctx.fill();

    // Highlight
    const highlightGradient = ctx.createRadialGradient(
      noseX - noseRadius * 0.35, noseY - noseRadius * 0.35, 0,
      noseX - noseRadius * 0.25, noseY - noseRadius * 0.25, noseRadius * 0.4
    );
    highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    highlightGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.3)");
    highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    
    ctx.beginPath();
    ctx.arc(noseX - noseRadius * 0.25, noseY - noseRadius * 0.25, noseRadius * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = highlightGradient;
    ctx.fill();

    // ===== ANTLERS =====
    const foreheadX = forehead.x * width;
    const foreheadY = forehead.y * height;
    const antlerHeight = faceHeight * 0.7;

    ctx.save();
    ctx.translate(foreheadX, foreheadY);
    ctx.rotate(angle);

    // Draw both antlers
    [-1, 1].forEach(side => {
      ctx.save();
      ctx.scale(side, 1);
      
      const baseX = faceWidth * 0.35;
      const baseY = -faceHeight * 0.1;

      // Main stem
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(baseX + 20, baseY - antlerHeight * 0.5, baseX + 10, baseY - antlerHeight);
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#5D4037";
      ctx.lineCap = "round";
      ctx.stroke();

      // Lighter inner stroke
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#795548";
      ctx.stroke();

      // Branch 1
      ctx.beginPath();
      ctx.moveTo(baseX + 5, baseY - antlerHeight * 0.3);
      ctx.quadraticCurveTo(baseX + 35, baseY - antlerHeight * 0.4, baseX + 45, baseY - antlerHeight * 0.2);
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#5D4037";
      ctx.stroke();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#795548";
      ctx.stroke();

      // Branch 2
      ctx.beginPath();
      ctx.moveTo(baseX + 10, baseY - antlerHeight * 0.6);
      ctx.quadraticCurveTo(baseX + 40, baseY - antlerHeight * 0.65, baseX + 50, baseY - antlerHeight * 0.5);
      ctx.lineWidth = 7;
      ctx.strokeStyle = "#5D4037";
      ctx.stroke();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#795548";
      ctx.stroke();

      // Branch 3 (top)
      ctx.beginPath();
      ctx.moveTo(baseX + 10, baseY - antlerHeight * 0.85);
      ctx.quadraticCurveTo(baseX + 25, baseY - antlerHeight * 0.9, baseX + 30, baseY - antlerHeight * 0.75);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#5D4037";
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }, []);

  /**
   * 🧝 DRAW ELF EARS
   */
  const drawElfEars = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
  ) => {
    const leftEar = landmarks[234];
    const rightEar = landmarks[454];
    const forehead = landmarks[10];
    const chin = landmarks[152];
    const leftTemple = landmarks[71];
    const rightTemple = landmarks[301];

    const faceHeight = Math.abs((chin.y - forehead.y) * height);
    const earHeight = faceHeight * 0.5;

    const angle = Math.atan2(
      (rightTemple.y - leftTemple.y) * height,
      (rightTemple.x - leftTemple.x) * width
    );

    // Draw both ears
    [
      { landmark: leftEar, side: -1 },
      { landmark: rightEar, side: 1 }
    ].forEach(({ landmark, side }) => {
      const earX = landmark.x * width;
      const earY = landmark.y * height;

      ctx.save();
      ctx.translate(earX, earY);
      ctx.rotate(angle);
      ctx.scale(side, 1);

      // Main ear shape
      ctx.beginPath();
      ctx.moveTo(0, -earHeight * 0.2);
      ctx.quadraticCurveTo(-earHeight * 0.1, -earHeight * 0.4, -earHeight * 0.4, -earHeight * 0.7);
      ctx.quadraticCurveTo(-earHeight * 0.5, -earHeight * 0.85, -earHeight * 0.3, -earHeight * 0.75);
      ctx.quadraticCurveTo(0, -earHeight * 0.4, earHeight * 0.1, earHeight * 0.1);
      ctx.closePath();

      // Ear gradient (green elf style)
      const earGradient = ctx.createLinearGradient(-earHeight * 0.3, -earHeight * 0.7, earHeight * 0.1, earHeight * 0.1);
      earGradient.addColorStop(0, "#90EE90");
      earGradient.addColorStop(0.3, "#228B22");
      earGradient.addColorStop(0.7, "#006400");
      earGradient.addColorStop(1, "#004d00");
      ctx.fillStyle = earGradient;
      ctx.fill();

      // Inner ear detail
      ctx.beginPath();
      ctx.moveTo(-earHeight * 0.05, -earHeight * 0.25);
      ctx.quadraticCurveTo(-earHeight * 0.15, -earHeight * 0.45, -earHeight * 0.25, -earHeight * 0.55);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(0, 100, 0, 0.5)";
      ctx.stroke();

      ctx.restore();
    });
  }, []);

  /**
   * ✨ DRAW CURVED TEXT
   * Draws "Santa Doesn't Know U Like I Do" curving from left cheek over forehead to right cheek
   */
  const drawCurvedText = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
  ) => {
    // Key landmarks: pink dots are cheeks (234, 454)
    const forehead = landmarks[10];
    const chin = landmarks[152];
    const leftCheek = landmarks[234];  // Left pink dot
    const rightCheek = landmarks[454]; // Right pink dot
    const leftTemple = landmarks[71];
    const rightTemple = landmarks[301];

    // Get positions in canvas coordinates
    const leftCheekX = leftCheek.x * width;
    const leftCheekY = leftCheek.y * height;
    const rightCheekX = rightCheek.x * width;
    const rightCheekY = rightCheek.y * height;
    const foreheadX = forehead.x * width;
    const foreheadY = forehead.y * height;

    const faceWidth = Math.abs(rightCheekX - leftCheekX);
    const faceHeight = Math.abs((chin.y - forehead.y) * height);

    // Center of the arc (between cheeks, at forehead level)
    const centerX = (leftCheekX + rightCheekX) / 2;
    const centerY = (leftCheekY + rightCheekY) / 2 + faceHeight * 0.1;

    // Calculate head rotation based on temples
    const headAngle = Math.atan2(
      (rightTemple.y - leftTemple.y) * height,
      (rightTemple.x - leftTemple.x) * width
    );

    // Arc radius - distance from center to cheeks plus some lift
    const radius = faceWidth / 2 + faceHeight * 0.15;

    const text = "Santa Doesn't Know U Like I Do";
    const fontSize = faceWidth * 0.085;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(headAngle);

    ctx.font = `bold ${fontSize}px 'Arial Black', Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Arc spans full semicircle from right cheek (0) over forehead to left cheek (PI)
    // Start from 0 (right side) and go to PI (left side) - the top half
    const startAngle = 0;      // Right cheek position 
    const endAngle = Math.PI;  // Left cheek position
    const totalAngle = endAngle - startAngle;

    const chars = text.split('');
    const spacing = totalAngle / chars.length;

    // Draw from right to left (due to mirror) so text reads correctly
    chars.forEach((char, i) => {
      const charAngle = startAngle + spacing * i + spacing / 2;
      const x = Math.cos(charAngle) * radius;
      const y = -Math.sin(charAngle) * radius - faceHeight * 0.4; // Above forehead

      ctx.save();
      ctx.translate(x, y);
      
      // Rotate character to follow the arc tangent
      ctx.rotate(-charAngle + Math.PI / 2);
      ctx.scale(-1, 1); // Flip for mirrored canvas

      // Text glow effect
      ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Gradient fill for festive look
      const textGradient = ctx.createLinearGradient(0, -fontSize / 2, 0, fontSize / 2);
      textGradient.addColorStop(0, "#FFD700"); // Gold top
      textGradient.addColorStop(0.5, "#FFFACD"); // Lemon chiffon
      textGradient.addColorStop(1, "#FFA500"); // Orange bottom

      ctx.fillStyle = textGradient;
      ctx.fillText(char, 0, 0);

      // Dark red outline for readability
      ctx.strokeStyle = "#8B0000";
      ctx.lineWidth = 1.5;
      ctx.strokeText(char, 0, 0);

      ctx.restore();
    });

    // Animated sparkles along the text arc
    const sparkleCount = 10;
    for (let i = 0; i < sparkleCount; i++) {
      const sparkleAngle = startAngle + (totalAngle / (sparkleCount - 1)) * i;
      const sparkleRadius = radius + 12 + Math.sin(Date.now() * 0.004 + i * 0.7) * 6;
      const sx = Math.cos(sparkleAngle) * sparkleRadius;
      const sy = -Math.sin(sparkleAngle) * sparkleRadius - faceHeight * 0.4;
      const sparkleSize = 3 + Math.sin(Date.now() * 0.006 + i) * 2;

      ctx.save();
      ctx.translate(sx, sy);
      
      // 4-point star sparkle
      ctx.beginPath();
      for (let j = 0; j < 4; j++) {
        const angle = (j * Math.PI / 2) + Date.now() * 0.002;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * sparkleSize, Math.sin(angle) * sparkleSize);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(Date.now() * 0.008 + i) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
      
      ctx.restore();
    }

    ctx.restore();
  }, []);

  /**
   * ❄️ DRAW SNOWFLAKES
   */
  const drawSnowflakes = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Update and draw snowflakes
    snowflakesRef.current.forEach(flake => {
      // Update position
      flake.y += flake.speed;
      flake.x += Math.sin(flake.angle + Date.now() * 0.001) * 0.001;
      flake.angle += 0.02;

      // Reset if off screen
      if (flake.y > 1.1) {
        flake.y = -0.1;
        flake.x = Math.random();
      }

      const x = flake.x * width;
      const y = flake.y * height;

      // Draw snowflake
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(flake.angle);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.moveTo(0, 0);
        ctx.lineTo(flake.size, 0);
        ctx.moveTo(flake.size * 0.5, -flake.size * 0.3);
        ctx.lineTo(flake.size * 0.7, 0);
        ctx.moveTo(flake.size * 0.5, flake.size * 0.3);
        ctx.lineTo(flake.size * 0.7, 0);
        ctx.rotate(Math.PI / 3);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.stroke();

      // Center sparkle
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity + 0.2})`;
      ctx.fill();

      ctx.restore();
    });
  }, []);

  /**
   * 🎀 DRAW ANTLER HEADBAND
   * Festive red headband with reindeer antlers, bells, and bows
   */
  const drawHeadband = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
  ) => {
    const forehead = landmarks[10];
    const chin = landmarks[152];
    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];
    const leftTemple = landmarks[71];
    const rightTemple = landmarks[301];

    const faceWidth = Math.abs((rightCheek.x - leftCheek.x) * width);
    const faceHeight = Math.abs((chin.y - forehead.y) * height);
    const foreheadX = forehead.x * width;
    const foreheadY = forehead.y * height;

    const angle = Math.atan2(
      (rightTemple.y - leftTemple.y) * height,
      (rightTemple.x - leftTemple.x) * width
    );

    ctx.save();
    ctx.translate(foreheadX, foreheadY);
    ctx.rotate(angle);

    const headbandY = -faceHeight * 0.35;
    const headbandWidth = faceWidth * 1.3;
    const headbandHeight = faceWidth * 0.12;

    // ===== RED VELVET HEADBAND =====
    ctx.beginPath();
    ctx.ellipse(0, headbandY, headbandWidth / 2, headbandHeight, 0, Math.PI, 0);
    const headbandGradient = ctx.createLinearGradient(0, headbandY - headbandHeight, 0, headbandY + headbandHeight);
    headbandGradient.addColorStop(0, "#cc0000");
    headbandGradient.addColorStop(0.3, "#ff2222");
    headbandGradient.addColorStop(0.7, "#cc0000");
    headbandGradient.addColorStop(1, "#880000");
    ctx.fillStyle = headbandGradient;
    ctx.fill();
    ctx.strokeStyle = "#660000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fuzzy texture on headband (small dots)
    for (let i = 0; i < 30; i++) {
      const fuzzyAngle = Math.PI + (Math.random() * Math.PI);
      const fuzzyX = Math.cos(fuzzyAngle) * (headbandWidth / 2) * Math.random();
      const fuzzyY = headbandY + (Math.random() - 0.5) * headbandHeight * 0.8;
      ctx.beginPath();
      ctx.arc(fuzzyX, fuzzyY, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fill();
    }

    // ===== LEFT ANTLER =====
    const antlerBaseX = -faceWidth * 0.35;
    const antlerBaseY = headbandY - 5;
    
    // Main antler branch
    ctx.save();
    ctx.translate(antlerBaseX, antlerBaseY);
    ctx.rotate(-0.15); // Slight outward tilt
    
    // Draw antler shape
    const drawAntler = (flip: boolean) => {
      const dir = flip ? -1 : 1;
      const antlerHeight = faceHeight * 0.5;
      const antlerWidth = faceWidth * 0.15;
      
      // Main trunk
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dir * antlerWidth * 0.3, -antlerHeight * 0.4, dir * antlerWidth * 0.2, -antlerHeight * 0.7);
      ctx.quadraticCurveTo(dir * antlerWidth * 0.1, -antlerHeight * 0.9, 0, -antlerHeight);
      ctx.lineWidth = faceWidth * 0.04;
      ctx.lineCap = "round";
      const antlerGradient = ctx.createLinearGradient(0, 0, 0, -antlerHeight);
      antlerGradient.addColorStop(0, "#8B4513"); // Saddle brown
      antlerGradient.addColorStop(0.5, "#A0522D"); // Sienna
      antlerGradient.addColorStop(1, "#D2691E"); // Chocolate
      ctx.strokeStyle = antlerGradient;
      ctx.stroke();

      // First branch
      ctx.beginPath();
      ctx.moveTo(dir * antlerWidth * 0.15, -antlerHeight * 0.35);
      ctx.quadraticCurveTo(dir * antlerWidth * 0.5, -antlerHeight * 0.45, dir * antlerWidth * 0.6, -antlerHeight * 0.55);
      ctx.lineWidth = faceWidth * 0.025;
      ctx.strokeStyle = antlerGradient;
      ctx.stroke();

      // Second branch
      ctx.beginPath();
      ctx.moveTo(dir * antlerWidth * 0.2, -antlerHeight * 0.6);
      ctx.quadraticCurveTo(dir * antlerWidth * 0.45, -antlerHeight * 0.65, dir * antlerWidth * 0.5, -antlerHeight * 0.8);
      ctx.lineWidth = faceWidth * 0.02;
      ctx.strokeStyle = antlerGradient;
      ctx.stroke();

      // Top tine
      ctx.beginPath();
      ctx.moveTo(0, -antlerHeight);
      ctx.quadraticCurveTo(dir * antlerWidth * 0.15, -antlerHeight * 1.1, dir * antlerWidth * 0.1, -antlerHeight * 1.15);
      ctx.lineWidth = faceWidth * 0.015;
      ctx.strokeStyle = antlerGradient;
      ctx.stroke();
    };
    
    drawAntler(false);
    ctx.restore();

    // ===== RIGHT ANTLER =====
    ctx.save();
    ctx.translate(-antlerBaseX, antlerBaseY);
    ctx.rotate(0.15); // Slight outward tilt
    ctx.scale(-1, 1); // Mirror
    drawAntler(false);
    ctx.restore();

    // ===== GOLDEN BELLS =====
    const bellPositions = [
      { x: -faceWidth * 0.25, y: headbandY - 3 },
      { x: faceWidth * 0.25, y: headbandY - 3 }
    ];

    bellPositions.forEach((pos, idx) => {
      const wobble = Math.sin(Date.now() * 0.006 + idx) * 2;
      
      // Bell body
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + wobble, faceWidth * 0.045, faceWidth * 0.055, 0, 0, Math.PI * 2);
      const bellGradient = ctx.createRadialGradient(
        pos.x - 3, pos.y + wobble - 3, 0,
        pos.x, pos.y + wobble, faceWidth * 0.06
      );
      bellGradient.addColorStop(0, "#FFD700"); // Gold
      bellGradient.addColorStop(0.5, "#DAA520"); // Goldenrod
      bellGradient.addColorStop(1, "#B8860B"); // Dark goldenrod
      ctx.fillStyle = bellGradient;
      ctx.fill();
      ctx.strokeStyle = "#8B6914";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Bell clapper
      ctx.beginPath();
      ctx.arc(pos.x, pos.y + faceWidth * 0.04 + wobble, faceWidth * 0.015, 0, Math.PI * 2);
      ctx.fillStyle = "#DAA520";
      ctx.fill();

      // Shine highlight
      ctx.beginPath();
      ctx.ellipse(pos.x - 3, pos.y - 3 + wobble, 3, 5, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fill();
    });

    // ===== CENTER BOW =====
    const bowY = headbandY - 8;
    const bowSize = faceWidth * 0.12;

    // Left loop
    ctx.beginPath();
    ctx.ellipse(-bowSize * 0.6, bowY, bowSize * 0.5, bowSize * 0.35, -0.3, 0, Math.PI * 2);
    const bowGradient = ctx.createLinearGradient(-bowSize, bowY - bowSize * 0.3, 0, bowY + bowSize * 0.3);
    bowGradient.addColorStop(0, "#228B22"); // Forest green
    bowGradient.addColorStop(0.5, "#32CD32"); // Lime green
    bowGradient.addColorStop(1, "#006400"); // Dark green
    ctx.fillStyle = bowGradient;
    ctx.fill();
    ctx.strokeStyle = "#004400";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Right loop
    ctx.beginPath();
    ctx.ellipse(bowSize * 0.6, bowY, bowSize * 0.5, bowSize * 0.35, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = bowGradient;
    ctx.fill();
    ctx.strokeStyle = "#004400";
    ctx.stroke();

    // Center knot
    ctx.beginPath();
    ctx.arc(0, bowY, bowSize * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "#228B22";
    ctx.fill();
    ctx.strokeStyle = "#004400";
    ctx.stroke();

    // Ribbon tails
    ctx.beginPath();
    ctx.moveTo(-bowSize * 0.15, bowY + bowSize * 0.15);
    ctx.quadraticCurveTo(-bowSize * 0.3, bowY + bowSize * 0.5, -bowSize * 0.1, bowY + bowSize * 0.7);
    ctx.lineWidth = bowSize * 0.15;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#228B22";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bowSize * 0.15, bowY + bowSize * 0.15);
    ctx.quadraticCurveTo(bowSize * 0.3, bowY + bowSize * 0.5, bowSize * 0.1, bowY + bowSize * 0.7);
    ctx.stroke();

    ctx.restore();
  }, []);

  /**
   * 🔍 DEBUG MESH
   */
  const drawDebugMesh = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number
  ) => {
    landmarks.forEach((landmark, index) => {
      const x = landmark.x * width;
      const y = landmark.y * height;
      
      let color = "rgba(0, 255, 0, 0.5)";
      let radius = 2;
      
      if (index === 1) { color = "#ff0000"; radius = 6; }
      else if (index === 10) { color = "#00ff00"; radius = 6; }
      else if (index === 152) { color = "#0000ff"; radius = 6; }
      else if ([33, 133, 362, 263].includes(index)) { color = "#ffff00"; radius = 4; }
      else if ([234, 454].includes(index)) { color = "#ff00ff"; radius = 4; }
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // Labels
    ctx.font = "12px monospace";
    ctx.fillStyle = "#ffffff";
    [
      { idx: 1, label: "#1 Nose" },
      { idx: 10, label: "#10 Forehead" },
      { idx: 152, label: "#152 Chin" },
    ].forEach(({ idx, label }) => {
      const x = landmarks[idx].x * width + 10;
      const y = landmarks[idx].y * height;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(-1, 1);
      ctx.fillText(label, -80, 0);
      ctx.restore();
    });
  }, []);

  /**
   * 🎯 PROCESS RESULTS
   */
  const processResults = useCallback((results: FaceMeshResults) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Always draw snowflakes if that filter is selected (even without face)
    if (currentFilter === "snowflakes") {
      drawSnowflakes(ctx, canvas.width, canvas.height);
    }

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setFaceDetected(true);
      
      // Loop through ALL detected faces
      results.multiFaceLandmarks.forEach((faceLandmarks: Landmark[]) => {
        const landmarks = faceLandmarks;

        switch (currentFilter) {
          case "santa_hat":
            drawSantaHat(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "mustache":
            drawMustache(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "reindeer":
            drawReindeer(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "elf":
            drawElfEars(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "santa_text":
            drawCurvedText(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "headband":
            drawHeadband(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "debug_mesh":
            drawDebugMesh(ctx, landmarks, canvas.width, canvas.height);
            break;
        }
      });

      // Debug info for first face
      const noseTip = results.multiFaceLandmarks[0][1];
      setDebugInfo(
        `Faces: ${results.multiFaceLandmarks.length} | Nose: (${(noseTip.x * canvas.width).toFixed(0)}, ${(noseTip.y * canvas.height).toFixed(0)})`
      );
    } else {
      setFaceDetected(false);
      setDebugInfo("No face detected");
    }
  }, [currentFilter, drawSantaHat, drawMustache, drawReindeer, drawElfEars, drawCurvedText, drawSnowflakes, drawHeadband, drawDebugMesh]);

  /**
   * 🚀 INITIALIZATION
   */
  useEffect(() => {
    let isMounted = true;

    const initFaceMesh = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
        }

        const FaceMesh = (window as any).FaceMesh;
        if (!FaceMesh) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
            script.crossOrigin = "anonymous";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load MediaPipe"));
            document.head.appendChild(script);
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 100));

        const FaceMeshClass = (window as any).FaceMesh;
        if (!FaceMeshClass) throw new Error("MediaPipe FaceMesh not available");

        const faceMesh = new FaceMeshClass({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 4,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results: FaceMeshResults) => {
          if (isMounted) processResults(results);
        });

        faceMeshRef.current = faceMesh;

        const detectLoop = async () => {
          if (!isMounted || !video || !faceMeshRef.current) return;
          if (video.readyState >= 2) await faceMeshRef.current.send({ image: video });
          animationFrameRef.current = requestAnimationFrame(detectLoop);
        };

        if (isMounted) {
          setIsLoading(false);
          detectLoop();
        }
      } catch (err) {
        console.error("Initialization error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize");
          setIsLoading(false);
        }
      }
    };

    initFaceMesh();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      faceMeshRef.current?.close?.();
    };
  }, [processResults]);

  // Sync canvas size
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const updateCanvasSize = () => {
      const rect = video.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    video.addEventListener("loadedmetadata", updateCanvasSize);
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(video);
    updateCanvasSize();

    return () => {
      video.removeEventListener("loadedmetadata", updateCanvasSize);
      resizeObserver.disconnect();
    };
  }, []);

  const currentFilterObj = FILTERS.find(f => f.id === currentFilter);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6"
      style={{
        background: "linear-gradient(135deg, #0D1F12 0%, #1A2F1E 40%, #0D3B1F 70%, #1F1515 100%)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
          🎄 Christmas Face Filters
        </h1>
        <p className="text-zinc-400 text-sm">
          Snapchat-style AR filters • Powered by MediaPipe
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 max-w-md text-center">
          <p className="font-bold mb-1">⚠️ Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl">
        {/* Video Container */}
        <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/50 shadow-2xl">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white">Loading Face Detection...</p>
                <p className="text-zinc-500 text-sm">Downloading model (~4MB)</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-auto"
            style={{ transform: "scaleX(-1)" }}
            muted
            playsInline
          />

          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Status indicators */}
          <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold ${
            faceDetected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            <div className={`w-2 h-2 rounded-full ${faceDetected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            {faceDetected ? "Face Detected" : "No Face"}
          </div>

          {currentFilterObj && currentFilterObj.id !== "none" && (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-bold flex items-center gap-2">
              <span>{currentFilterObj.emoji}</span>
              <span>{currentFilterObj.name}</span>
            </div>
          )}

          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/60 text-zinc-300 text-xs font-mono">
            {debugInfo}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full lg:w-72 space-y-3">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h2 className="text-base font-bold text-white mb-3">🎭 Choose Filter</h2>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setCurrentFilter(filter.id)}
                  className={`p-3 rounded-xl transition-all ${
                    currentFilter === filter.id
                      ? "bg-green-600 text-white scale-105 shadow-lg shadow-green-500/30"
                      : "bg-white/10 text-zinc-300 hover:bg-white/20"
                  }`}
                >
                  <div className="text-xl mb-0.5">{filter.emoji}</div>
                  <div className="text-xs font-bold">{filter.name}</div>
                </button>
              ))}
            </div>
          </div>

          {currentFilterObj && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-zinc-300 text-sm">
                <span className="text-2xl mr-2">{currentFilterObj.emoji}</span>
                {currentFilterObj.description}
              </p>
            </div>
          )}

          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
            >
              ← Back to Photobooth
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-zinc-500 text-sm">
        💡 Move your head to see filters follow your face in real-time!
      </p>
    </div>
  );
}
