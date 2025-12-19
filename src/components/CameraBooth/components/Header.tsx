import { colors, colorArray, FILTERS } from "../../ui";

interface HeaderProps {
  currentFilter: string;
  currentShotIndex: number;
  onFilterClick: () => void;
}

/**
 * Header Component
 * Christmas branding header with event title and filter preview
 */
export default function Header({
  currentFilter,
  currentShotIndex,
  onFilterClick,
}: HeaderProps) {
  const currentFilterObj =
    FILTERS.find((f) => f.value === currentFilter) || FILTERS[0];

  return (
    <>
      {/* Header with Christmas branding */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex gap-1">
            {colorArray.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: color,
                  animation: `twinkle ${2 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          <span className="text-zinc-400 text-sm font-medium tracking-wider uppercase">
            PHOTOBOOTH
          </span>
        </div>
        <h1
          className="text-3xl md:text-4xl font-black bg-clip-text text-transparent leading-tight"
          style={{
            backgroundImage: `linear-gradient(135deg, ${colors.red}, ${colors.green}, ${colors.gold}, ${colors.white})`,
            backgroundSize: "300% 300%",
            animation: "gradientShift 5s ease infinite",
          }}
        >
          Santa Doesn't Know U Like I Do
        </h1>
        <img
          src="/assets/uiux-in-action.webp"
          alt="UI/UX In Action"
          className="h-8 md:h-30 w-auto object-contain"
        />
        <p className="text-zinc-400 mt-2 flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: colors.green }}
          />
          Shot {Math.min(currentShotIndex + 1, 3)} of 3
        </p>
      </div>

      {/* Quick Filter Preview */}
      <div
        className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
        onClick={onFilterClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full overflow-hidden"
              style={{
                border: `2px solid ${currentFilterObj.color}`,
              }}
            >
              <img
                src="/sparky.webp"
                alt="Filter preview"
                className="w-full h-full object-cover"
                style={{ filter: currentFilter || "none" }}
              />
            </div>
            <div>
              <div className="text-white font-bold">{currentFilterObj.name}</div>
              <div className="text-zinc-500 text-sm">Current filter</div>
            </div>
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${colors.red}30, ${colors.green}30)`,
              color: colors.red,
            }}
          >
            Change
          </div>
        </div>
      </div>
    </>
  );
}
