import { AuroraBackground } from "@/components/ui/aurora-background";
import MorphOrb from "@/components/ai-thiking-orb-and-input";

export default function App() {
  return (
    <div className="dark min-h-svh w-full bg-zinc-950">
      <AuroraBackground
        className="h-svh w-full overflow-hidden bg-zinc-950 text-white"
        showRadialGradient={true}
      >
        <div className="relative z-10 h-full w-full">
          <MorphOrb />
        </div>
      </AuroraBackground>
    </div>
  );
}