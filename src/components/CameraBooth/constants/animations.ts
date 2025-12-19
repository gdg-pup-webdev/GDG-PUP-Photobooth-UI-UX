import { colors } from "../../ui";

// CSS Animation keyframes as a template string for styled-jsx
export const CAMERA_ANIMATIONS = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
  }
  
  @keyframes twinkle {
    0%, 100% {
      opacity: 0.2;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px ${colors.green}40, 0 0 40px ${colors.green}20;
    }
    25% {
      box-shadow: 0 0 20px ${colors.red}40, 0 0 40px ${colors.red}20;
    }
    50% {
      box-shadow: 0 0 20px ${colors.gold}40, 0 0 40px ${colors.gold}20;
    }
    75% {
      box-shadow: 0 0 20px ${colors.white}40, 0 0 40px ${colors.white}20;
    }
  }
  
  @keyframes snowfall {
    0% {
      transform: translateY(-10px) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes countBounce {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
