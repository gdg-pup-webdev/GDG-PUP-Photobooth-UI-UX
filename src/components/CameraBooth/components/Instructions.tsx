import { colors } from "../../ui";

/**
 * Instructions Component
 * "How it works" step-by-step guide
 */
export default function Instructions() {
  const steps = [
    { text: "Choose your favorite filter", color: colors.green },
    { text: "Press the capture button to take 3 shots", color: colors.red },
    { text: "Review and retake if needed", color: colors.gold },
    { text: "Download or email your photo strip!", color: colors.green },
  ];

  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
        How it works
      </h3>
      <ol className="space-y-3 text-zinc-400 text-sm">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
              style={{ background: step.color, color: "#fff" }}
            >
              {i + 1}
            </span>
            <span>{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
