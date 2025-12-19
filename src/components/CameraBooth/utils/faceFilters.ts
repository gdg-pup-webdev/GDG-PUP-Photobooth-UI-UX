
// Types for Face Messenger
export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface FaceMeshResults {
  multiFaceLandmarks?: Landmark[][];
}

export interface Filter {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
}

export const STICKER_FILTERS: Filter[] = [
  { id: "none", name: "None", emoji: "❌", description: "No sticker" },
  { id: "santa_hat", name: "Santa Hat", emoji: "🎅", description: "Classic Santa Hat" },
  { id: "mustache", name: "Mustache", emoji: "🥸", description: "Fluffy white mustache" },
  { id: "reindeer", name: "Reindeer", emoji: "🦌", description: "Rudolf with antlers" },
  { id: "santa_text", name: "Santa Text", emoji: "✨", description: "Curved event title" },
  { id: "snowflakes", name: "Snowflakes", emoji: "❄️", description: "Magical snow" },
  { id: "glasses", name: "Cool Glasses", emoji: "🕶️", description: "Stylish shades" },
  { id: "sparky", name: "Sparky", emoji: "🐶", description: "Join Sparky!" },
  { id: "debug", name: "Debug", emoji: "🔍", description: "View face coordinates" },
];

/**
 * 🎅 DRAW SANTA HAT
 * Draws a 2D Santa hat using canvas paths
 */
export const drawSantaHat = (
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  width: number,
  height: number
) => {
  const forehead = landmarks[10];
  const leftTemple = landmarks[127]; // Wider point
  const rightTemple = landmarks[356]; // Wider point

  // Calculate dimensions
  // Multiplier 1.4 for smaller hat
  const hatWidth = Math.abs(rightTemple.x - leftTemple.x) * width * 1.1;
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
};

/**
 * 🥸 DRAW MUSTACHE
 * Draws a fluffy white handlebar mustache
 */
export const drawMustache = (
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  width: number,
  height: number
) => {
  // Key landmarks for mustache positioning
  const noseTip = landmarks[1];
  const upperLipTop = landmarks[0]; // Center of upper lip
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
};

/**
 * 🦌 DRAW REINDEER
 * Rudolf nose + antlers
 */
export const drawReindeer = (
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
};

/**
 * 🧝 DRAW ELF EARS
 */
export const drawElfEars = (
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
};

/**
 * ✨ DRAW CURVED TEXT
 * Draws "Santa Doesn't Know U Like I Do" curving from left cheek over forehead to right cheek
 */
export const drawCurvedText = (
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
  const radius = faceWidth * 0.6 + faceHeight * 0.15;

  const text = "Santa Doesn't Know U Like I Do";
  const fontSize = faceWidth * 0.125;

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
    const y = -Math.sin(charAngle) * radius - faceHeight * 0.2; // Closer to head

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
    const sy = -Math.sin(sparkleAngle) * sparkleRadius - faceHeight * 0.1;
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
};

/**
 * ❄️ DRAW SNOWFLAKES
 */
export const drawSnowflakes = (
  ctx: CanvasRenderingContext2D,
  snowflakes: Snowflake[], // Passed in
  width: number,
  height: number
) => {
  // Update and draw snowflakes
  snowflakes.forEach(flake => {
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
};

/**
 * 🕶️ DRAW CHRISTMAS GLASSES
 * Festive glasses with red & green frames and holiday flair!
 */
export const drawGlasses = (
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  width: number,
  height: number
) => {
  // Key eye landmarks
  const leftEyeOuter = landmarks[33];
  const leftEyeInner = landmarks[133];
  const rightEyeInner = landmarks[362];
  const rightEyeOuter = landmarks[263];
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const noseBridge = landmarks[6];
  const leftTemple = landmarks[71];
  const rightTemple = landmarks[301];

  // Calculate positions - offset to create gap between lenses
  const lensGap = width * 0.02; // Gap between lenses
  const leftCenterX = ((leftEyeOuter.x + leftEyeInner.x) / 2) * width - lensGap;
  const leftCenterY = ((leftEyeTop.y + leftEyeBottom.y) / 2) * height;
  const rightCenterX = ((rightEyeOuter.x + rightEyeInner.x) / 2) * width + lensGap;
  const rightCenterY = leftCenterY;

  const eyeWidth = Math.abs(leftEyeInner.x - leftEyeOuter.x) * width * 2.0; // Reduced from 2.4
  const eyeHeight = eyeWidth * 0.65;

  // Head rotation
  const angle = Math.atan2(
    (rightTemple.y - leftTemple.y) * height,
    (rightTemple.x - leftTemple.x) * width
  );

  ctx.save();
  const centerX = (leftCenterX + rightCenterX) / 2;
  const centerY = (leftCenterY + rightCenterY) / 2;
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
  ctx.translate(-centerX, -centerY);

  // Shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;

  const lensRadius = eyeHeight * 0.35;

  // === LEFT LENS (Red tinted) ===
  const leftLensGradient = ctx.createRadialGradient(
    leftCenterX, leftCenterY, 0,
    leftCenterX, leftCenterY, eyeWidth * 0.6
  );
  leftLensGradient.addColorStop(0, "rgba(139, 0, 0, 0.7)");
  leftLensGradient.addColorStop(0.5, "rgba(100, 0, 0, 0.8)");
  leftLensGradient.addColorStop(1, "rgba(60, 0, 0, 0.9)");

  ctx.beginPath();
  ctx.roundRect(
    leftCenterX - eyeWidth / 2,
    leftCenterY - eyeHeight / 2,
    eyeWidth,
    eyeHeight,
    lensRadius
  );
  ctx.fillStyle = leftLensGradient;
  ctx.fill();

  // Left lens sparkle
  ctx.beginPath();
  ctx.ellipse(
    leftCenterX - eyeWidth * 0.2,
    leftCenterY - eyeHeight * 0.2,
    eyeWidth * 0.12,
    eyeHeight * 0.08,
    -0.4,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.fill();

  // === RIGHT LENS (Green tinted) ===
  const rightLensGradient = ctx.createRadialGradient(
    rightCenterX, rightCenterY, 0,
    rightCenterX, rightCenterY, eyeWidth * 0.6
  );
  rightLensGradient.addColorStop(0, "rgba(0, 100, 0, 0.7)");
  rightLensGradient.addColorStop(0.5, "rgba(0, 70, 0, 0.8)");
  rightLensGradient.addColorStop(1, "rgba(0, 40, 0, 0.9)");

  ctx.beginPath();
  ctx.roundRect(
    rightCenterX - eyeWidth / 2,
    rightCenterY - eyeHeight / 2,
    eyeWidth,
    eyeHeight,
    lensRadius
  );
  ctx.fillStyle = rightLensGradient;
  ctx.fill();

  // Right lens sparkle
  ctx.beginPath();
  ctx.ellipse(
    rightCenterX - eyeWidth * 0.2,
    rightCenterY - eyeHeight * 0.2,
    eyeWidth * 0.12,
    eyeHeight * 0.08,
    -0.4,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.fill();

  // === FRAMES (Festive Red) ===
  ctx.shadowColor = "transparent";
  ctx.lineWidth = eyeHeight * 0.15;
  ctx.strokeStyle = "#BB2528"; // Christmas Red
  ctx.lineCap = "round";

  // Left frame
  ctx.beginPath();
  ctx.roundRect(
    leftCenterX - eyeWidth / 2,
    leftCenterY - eyeHeight / 2,
    eyeWidth,
    eyeHeight,
    lensRadius
  );
  ctx.stroke();

  // Right frame
  ctx.beginPath();
  ctx.roundRect(
    rightCenterX - eyeWidth / 2,
    rightCenterY - eyeHeight / 2,
    eyeWidth,
    eyeHeight,
    lensRadius
  );
  ctx.stroke();

  // === BRIDGE (Green - connects the two lenses) ===
  ctx.strokeStyle = "#165B33"; // Christmas Green
  ctx.lineWidth = eyeHeight * 0.18; // Thicker bridge
  ctx.beginPath();
  ctx.moveTo(leftCenterX + eyeWidth / 2, leftCenterY);
  ctx.lineTo(rightCenterX - eyeWidth / 2, rightCenterY); // Straight line
  ctx.stroke();

  // === TEMPLES (Candy Cane Style) ===
  const templeWidth = eyeHeight * 0.1;

  // Left temple - Red base
  ctx.lineWidth = templeWidth;
  ctx.strokeStyle = "#BB2528";
  ctx.beginPath();
  ctx.moveTo(leftCenterX - eyeWidth / 2, leftCenterY);
  ctx.lineTo(leftTemple.x * width - 25, leftTemple.y * height);
  ctx.stroke();

  // Left temple - White stripes
  ctx.lineWidth = templeWidth * 0.3;
  ctx.strokeStyle = "#FFFFFF";
  ctx.setLineDash([8, 12]);
  ctx.beginPath();
  ctx.moveTo(leftCenterX - eyeWidth / 2, leftCenterY);
  ctx.lineTo(leftTemple.x * width - 25, leftTemple.y * height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Right temple - Red base
  ctx.lineWidth = templeWidth;
  ctx.strokeStyle = "#BB2528";
  ctx.beginPath();
  ctx.moveTo(rightCenterX + eyeWidth / 2, rightCenterY);
  ctx.lineTo(rightTemple.x * width + 25, rightTemple.y * height);
  ctx.stroke();

  // Right temple - White stripes
  ctx.lineWidth = templeWidth * 0.3;
  ctx.strokeStyle = "#FFFFFF";
  ctx.setLineDash([8, 12]);
  ctx.beginPath();
  ctx.moveTo(rightCenterX + eyeWidth / 2, rightCenterY);
  ctx.lineTo(rightTemple.x * width + 25, rightTemple.y * height);
  ctx.stroke();
  ctx.setLineDash([]);

  // === GOLD STAR DECORATIONS ===
  const drawStar = (x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + Math.PI / 5;
      if (i === 0) {
        ctx.moveTo(Math.cos(outerAngle) * size, Math.sin(outerAngle) * size);
      } else {
        ctx.lineTo(Math.cos(outerAngle) * size, Math.sin(outerAngle) * size);
      }
      ctx.lineTo(Math.cos(innerAngle) * size * 0.4, Math.sin(innerAngle) * size * 0.4);
    }
    ctx.closePath();
    ctx.fillStyle = "#D4AF37";
    ctx.fill();
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  };

  // Stars on frame corners
  const starSize = eyeHeight * 0.2;
  drawStar(leftCenterX - eyeWidth / 2 + lensRadius, leftCenterY - eyeHeight / 2 - 2, starSize);
  drawStar(rightCenterX + eyeWidth / 2 - lensRadius, rightCenterY - eyeHeight / 2 - 2, starSize);

  // === HOLLY BERRIES on bridge ===
  const berryX = noseBridge.x * width;
  const berryY = noseBridge.y * height - eyeHeight * 0.3;

  // Berries
  ctx.beginPath();
  ctx.arc(berryX - 4, berryY, 4, 0, Math.PI * 2);
  ctx.arc(berryX + 4, berryY, 4, 0, Math.PI * 2);
  ctx.arc(berryX, berryY - 5, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#BB2528";
  ctx.fill();

  // Holly leaves
  ctx.fillStyle = "#165B33";
  ctx.beginPath();
  ctx.ellipse(berryX - 10, berryY + 3, 8, 4, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(berryX + 10, berryY + 3, 8, 4, 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

/**
 * 🎀 DRAW ANTLER HEADBAND
 */
export const drawHeadband = (
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
};

/**
 * 🔍 DEBUG MESH
 * Visualize face landmarks with colored dots and labels
 */
export const drawDebugMesh = (
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

    // Highlight key landmarks with different colors
    if (index === 1) { color = "#ff0000"; radius = 6; } // Nose - Red
    else if (index === 10) { color = "#00ff00"; radius = 6; } // Forehead - Green
    else if (index === 152) { color = "#0000ff"; radius = 6; } // Chin - Blue
    else if ([33, 133, 362, 263].includes(index)) { color = "#ffff00"; radius = 4; } // Eyes - Yellow
    else if ([234, 454].includes(index)) { color = "#ff00ff"; radius = 4; } // Cheeks - Magenta

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // Labels for key landmarks
  ctx.font = "12px monospace";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;

  [
    { idx: 1, label: "#1 Nose" },
    { idx: 10, label: "#10 Forehead" },
    { idx: 152, label: "#152 Chin" },
  ].forEach(({ idx, label }) => {
    const x = landmarks[idx].x * width + 10;
    const y = landmarks[idx].y * height;

    // Draw text with outline for readability
    ctx.strokeText(label, x, y);
    ctx.fillText(label, x, y);
  });
};

/**
 * 🐶 DRAW SPARKY
 * Draws Sparky image with dynamic position and sharp quality
 */
export const drawSparky = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  xPct?: number,
  yPct?: number,
  scale?: number
) => {
  if (!image) return;

  // Defaults
  const currentScale = scale ?? 0.8; // 80% of screen height default for better visibility
  const currentX = xPct ?? 0.5; // Center
  const currentY = yPct ?? 1.0; // Bottom aligned by default logic below

  // Calculate dimensions
  const sparkyHeight = height * currentScale;
  const aspectRatio = image.width / image.height;
  const sparkyWidth = sparkyHeight * aspectRatio;

  // Position
  let x, y;

  if (xPct !== undefined && yPct !== undefined) {
    // Center on the point
    x = (currentX * width) - (sparkyWidth / 2);
    y = (currentY * height) - (sparkyHeight / 2);
  } else {
    // Default bottom center
    x = (width - sparkyWidth) / 2;
    y = height - sparkyHeight;
  }

  ctx.save();

  // Enable high-quality image smoothing for sharp rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Add a drop shadow for realism
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;

  ctx.drawImage(image, x, y, sparkyWidth, sparkyHeight);

  ctx.restore();
};
