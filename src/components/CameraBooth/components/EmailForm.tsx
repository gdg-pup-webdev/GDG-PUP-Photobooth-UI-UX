import { colors } from "../../ui";

interface EmailFormProps {
  email: string;
  sending: boolean;
  sent: boolean;
  emailError: string;
  onEmailChange: (value: string) => void;
  onSend: () => void;
}

/**
 * EmailForm Component
 * Email input and send functionality with error handling
 */
export default function EmailForm({
  email,
  sending,
  sent,
  emailError,
  onEmailChange,
  onSend,
}: EmailFormProps) {
  if (sent) {
    return (
      <div
        className="flex items-center gap-3 p-4 rounded-xl"
        style={{
          background: `${colors.green}20`,
          border: `1px solid ${colors.green}50`,
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: colors.green }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <div className="font-bold" style={{ color: colors.green }}>
            Email Sent!
          </div>
          <div className="text-zinc-400 text-sm">Check your inbox</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email"
          className="w-full py-4 px-5 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{
            background: email
              ? `linear-gradient(90deg, ${colors.red}, ${colors.green})`
              : "transparent",
          }}
        />
      </div>

      <button
        disabled={!email || sending}
        onClick={onSend}
        className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
        style={{
          background:
            !email || sending
              ? "#444"
              : `linear-gradient(135deg, ${colors.gold}, ${colors.red})`,
          boxShadow:
            !email || sending ? "none" : `0 15px 35px ${colors.gold}40`,
          color: "#fff",
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        {sending ? "Sending..." : "Send to Email"}
      </button>

      {/* Error message */}
      {emailError && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{
            background: `${colors.red}20`,
            border: `1px solid ${colors.red}50`,
          }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: colors.red }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <div className="font-bold" style={{ color: colors.red }}>
              Error Sending Email
            </div>
            <div className="text-zinc-400 text-sm">{emailError}</div>
          </div>
        </div>
      )}
    </div>
  );
}
