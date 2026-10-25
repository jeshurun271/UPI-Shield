import { useRef } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import MorphOrb from "@/components/ai-thiking-orb-and-input";
import { CreateMLCEngine } from "@mlc-ai/web-llm";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

const MODEL = "SmolLM2-360M-Instruct-q4f16_1-MLC";

let enginePromise: Promise<any> | null = null;

function getEngine() {
  if (!enginePromise) {
    enginePromise = CreateMLCEngine(MODEL, {
      initProgressCallback: (p) => {
        console.log("[UPI Shield AI]", p.text);
      },
    });
  }
  return enginePromise;
}

export default function App() {
  const history = useRef<Msg[]>([]);

  const askAI = async (message: string): Promise<string> => {
    try {
      const engine = await getEngine();

      const messages = [
        {
          role: "system",
          content:
            "You are UPI Shield AI, a helpful cybersecurity assistant. " +
            "Help users identify UPI scams, suspicious payments, phishing, " +
            "fraudulent links and unsafe financial requests. Be clear, practical " +
            "and concise. Never ask for passwords, OTPs, PINs, CVV numbers or API keys.",
        },
        ...history.current.slice(-8),
        { role: "user", content: message },
      ];

      const result = await engine.chat.completions.create({
        messages,
        temperature: 0.5,
        max_tokens: 350,
      });

      const reply =
        result.choices?.[0]?.message?.content?.trim() ||
        "I couldn't generate a response.";

      history.current = [
        ...history.current,
        { role: "user", content: message },
        { role: "assistant", content: reply },
      ].slice(-10);

      return reply;
    } catch (error) {
      console.error(error);

      return "The local AI is still loading. Please try your question again in a moment.";
    }
  };

  return (
    <div className="dark min-h-svh w-full bg-zinc-950">
      <AuroraBackground
        className="h-svh w-full overflow-hidden bg-zinc-950 text-white"
        showRadialGradient={true}
      >
        <div className="relative z-10 h-full w-full">
          <MorphOrb onSubmit={askAI} />
        </div>
      </AuroraBackground>
    </div>
  );
}
