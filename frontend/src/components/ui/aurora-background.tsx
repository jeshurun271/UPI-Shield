"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import type { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient: _showRadialGradient,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main className="min-h-svh w-full bg-[#09090b] text-white">
      <div
        className={cn(
          "relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-[#09090b] text-white",
          className,
        )}
        {...props}
        style={{
          ...props.style,
          background: "#09090b",
          backgroundImage: "none",
        }}
      >
        {children}
      </div>
    </main>
  );
};