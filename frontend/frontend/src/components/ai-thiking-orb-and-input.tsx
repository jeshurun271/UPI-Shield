import { useEffect, useRef, useState } from "react";

interface MorphOrbProps {
  onSubmit?: (text: string) => Promise<string> | string;
  minThinkMs?: number;
  speed?: number;
}

export default function MorphOrb({
  onSubmit,
  minThinkMs = 900,
}: MorphOrbProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [thinking, setThinking] = useState(false);
  const [entered, setEntered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setEntered(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    const message = input.trim();

    if (!message || thinking) return;

    setThinking(true);
    setResponse("");

    try {
      const result = onSubmit
        ? await onSubmit(message)
        : "UPI Shield is ready to analyse your message.";

      const elapsed = 900;
      if (elapsed < minThinkMs) {
        await new Promise((resolve) =>
          setTimeout(resolve, minThinkMs - elapsed)
        );
      }

      setResponse(result);
      setInput("");
    } catch {
      setResponse("Unable to analyse this request. Please try again.");
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <style>{`
        @keyframes orbEntrance {
          0% {
            transform: translate3d(0, 65vh, 0) scale(.72);
            opacity: 0;
          }
          55% {
            transform: translate3d(0, -18px, 0) scale(1.06);
            opacity: 1;
          }
          75% {
            transform: translate3d(0, 7px, 0) scale(.98);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
          }
        }

        @keyframes orbFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes orbPulse {
          0%, 100% {
            box-shadow:
              0 0 35px rgba(120, 180, 255, .20),
              0 0 90px rgba(100, 120, 255, .12);
          }
          50% {
            box-shadow:
              0 0 55px rgba(120, 180, 255, .35),
              0 0 130px rgba(100, 120, 255, .20);
          }
        }

        .orb-entrance {
          animation:
            orbEntrance 1.15s cubic-bezier(.16,1,.3,1) forwards;
        }

        .orb-floating {
          animation:
            orbFloat 4s ease-in-out infinite,
            orbPulse 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`
          relative z-20 flex w-full max-w-3xl flex-col items-center
          px-6 transition-opacity duration-300
          ${entered ? "opacity-100" : "opacity-0"}
        `}
      >
        <div
          className={`
            orb-entrance
            ${entered ? "orb-floating" : ""}
            relative mb-10 flex h-40 w-40 items-center justify-center
            rounded-full
            border border-white/10
            bg-white/[0.035]
            backdrop-blur-xl
          `}
        >
          <div className="absolute inset-5 rounded-full bg-gradient-to-br from-white/20 via-blue-400/10 to-transparent blur-xl" />

          <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-white/30 via-blue-400/20 to-indigo-500/20 shadow-[inset_0_0_35px_rgba(255,255,255,.12)]">
            <div className="absolute inset-3 rounded-full bg-black/40 backdrop-blur-md" />

            <div
              className={`absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-[1px] ${
                thinking ? "animate-ping" : ""
              }`}
            />
          </div>
        </div>

        {response && (
          <div className="mb-6 max-h-48 w-full overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-6 text-white/80 backdrop-blur-xl">
            {response}
          </div>
        )}

        <div className="flex w-full items-center gap-3 rounded-full border border-white/10 bg-black/30 p-2 shadow-2xl backdrop-blur-xl">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            disabled={thinking}
            placeholder={
              thinking
                ? "Analysing..."
                : "Ask UPI Shield about a suspicious payment..."
            }
            className="flex-1 bg-transparent px-5 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || thinking}
            className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {thinking ? "..." : "Analyse"}
          </button>
        </div>
      </div>
    </div>
  );
}