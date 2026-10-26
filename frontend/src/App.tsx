import { useRef } from "react";
import MorphOrb from "@/components/ui/ai-thiking-orb-and-input";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

const API_URL = "http://127.0.0.1:3001/api/chat";

export default function App() {
  const historyRef = useRef<ChatMessage[]>([]);

  const askAI = async (message: string): Promise<string> => {
    const text = message.trim();

    if (!text) {
      return "";
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: historyRef.current.slice(-10),
        }),
      });

      const data: { reply?: unknown; error?: unknown } =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "The AI server could not answer.",
        );
      }

      const reply =
        typeof data.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "The AI returned an empty response.";

      historyRef.current = [
        ...historyRef.current,
        { role: "user", text },
        { role: "model", text: reply },
      ].slice(-12);

      return reply;
    } catch (error) {
      console.error("[UPI Shield AI]", error);
      return "The AI server could not respond right now. Please try again.";
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      <MorphOrb onSubmit={askAI} />
    </main>
  );
}