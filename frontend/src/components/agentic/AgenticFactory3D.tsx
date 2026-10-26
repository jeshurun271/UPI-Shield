import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  Link2,
  CreditCard,
  BadgeCheck,
  FlagTriangleRight,
  X,
} from "lucide-react";

import { SplineScene } from "../ui/splite";
import { PearlButton } from "../ui/pearl-button";

const SPLINE_SCENE =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

type Rule = {
  id: string;
  label: string;
  title: string;
  explanation: string;
  redFlags: string[];
  action: string;
  Icon: typeof ShieldCheck;
};

const RULES: Rule[] = [
  {
    id: "pin",
    label: "PIN & OTP",
    title: "Protect your PIN and OTP",
    explanation:
      "Your UPI PIN and OTP are private authentication credentials. Genuine banks and payment services will never ask you to disclose them to receive money or resolve a payment issue.",
    redFlags: [
      "Someone asks for your UPI PIN",
      "Someone asks for an OTP",
      "Pressure to provide the code immediately",
    ],
    action:
      "Stop the interaction. Never share or enter your real PIN or OTP in response to an unsolicited request.",
    Icon: ShieldCheck,
  },
  {
    id: "links",
    label: "SUSPICIOUS LINKS",
    title: "Verify links before opening",
    explanation:
      "Fraudsters commonly use fake bank, KYC, cashback and payment links to direct people to phishing pages or malicious websites.",
    redFlags: [
      "Unexpected links in SMS or WhatsApp",
      "Urgent account-verification messages",
      "Unknown or shortened web addresses",
    ],
    action:
      "Do not open the link. Access your bank or UPI service directly through its official application or website.",
    Icon: Link2,
  },
  {
    id: "payment",
    label: "PAYMENT REQUESTS",
    title: "Check every payment request",
    explanation:
      "A UPI payment or collect request should always be reviewed before approval. Approving a suspicious request can authorize money to leave your account.",
    redFlags: [
      "Unexpected collect requests",
      "Someone says you must approve a request to receive money",
      "Pressure to approve immediately",
    ],
    action:
      "Review the recipient and amount carefully. Reject unexpected or suspicious requests.",
    Icon: CreditCard,
  },
  {
    id: "kyc",
    label: "FAKE KYC",
    title: "Be alert to fake KYC requests",
    explanation:
      "Scammers may impersonate banks or financial services and threaten account suspension unless you complete KYC through an unfamiliar link or provide sensitive information.",
    redFlags: [
      "Threats of account suspension",
      "KYC requests through unknown messages",
      "Requests for OTP or PIN",
      "Requests to install remote-access software",
    ],
    action:
      "Verify KYC only through your bank's official application, website or customer-care channel.",
    Icon: BadgeCheck,
  },
  {
    id: "report",
    label: "REPORT FRAUD",
    title: "Report suspected fraud quickly",
    explanation:
      "If you suspect that a digital-payment transaction is fraudulent, acting quickly is important. Contact your bank and report the incident through the official cybercrime channels.",
    redFlags: [
      "An unauthorized transaction appears",
      "Money has been transferred to a scammer",
      "Sensitive information was shared with a suspicious person",
    ],
    action:
      "Contact your bank immediately. For financial cyber fraud, call 1930 and report through cybercrime.gov.in.",
    Icon: FlagTriangleRight,
  },
];

export function AgenticFactory3D() {
  const [activeRule, setActiveRule] = useState<string | null>(null);

  const toggleRule = (id: string) => {
    setActiveRule((current) => (current === id ? null : id));
  };

  const active = RULES.find((rule) => rule.id === activeRule);

  return (
    <div className="relative h-full min-h-[700px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-black">

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_48%,rgba(245,158,11,.09),transparent_38%)]" />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,.035),transparent_42%)]" />

      {/* Header */}
      <div className="pointer-events-none absolute left-7 top-7 z-50">
        <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-400">
          UPI SHIELD
        </div>

        <div className="mt-2 text-xl font-semibold tracking-tight text-white md:text-2xl">
          Interactive Safety System
        </div>

        <div className="mt-1 max-w-[360px] text-xs leading-relaxed text-white/45">
          Select a protection rule to understand the threat and the correct
          response.
        </div>
      </div>

      {/* Status */}
      <div className="pointer-events-none absolute right-7 top-7 z-50 hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-300 md:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
        Protection Active
      </div>

      {/* Spline */}
      <div className="absolute inset-0 z-0">
        <SplineScene
          scene={SPLINE_SCENE}
          className="h-full w-full"
        />
      </div>

      {/* Central focus ring */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.018]" />

      {/* Connection lines */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
        <div className="absolute left-[18%] top-[32%] h-px w-[17%] rotate-[10deg] bg-gradient-to-r from-white/15 to-transparent" />

        <div className="absolute right-[18%] top-[32%] h-px w-[17%] -rotate-[10deg] bg-gradient-to-l from-white/15 to-transparent" />

        <div className="absolute left-[17%] top-[59%] h-px w-[18%] -rotate-[7deg] bg-gradient-to-r from-white/15 to-transparent" />

        <div className="absolute right-[17%] top-[59%] h-px w-[18%] rotate-[7deg] bg-gradient-to-l from-white/15 to-transparent" />

        <div className="absolute bottom-[18%] left-1/2 h-[12%] w-px -translate-x-1/2 bg-gradient-to-b from-white/15 to-transparent" />
      </div>

      {/* RULE 1 */}
      <RuleButton
        rule={RULES[0]}
        active={activeRule === "pin"}
        position="left-[7%] top-[30%]"
        onClick={() => toggleRule("pin")}
      />

      {/* RULE 2 */}
      <RuleButton
        rule={RULES[1]}
        active={activeRule === "links"}
        position="right-[7%] top-[30%]"
        onClick={() => toggleRule("links")}
      />

      {/* RULE 3 */}
      <RuleButton
        rule={RULES[2]}
        active={activeRule === "payment"}
        position="left-[5%] top-[58%]"
        onClick={() => toggleRule("payment")}
      />

      {/* RULE 4 */}
      <RuleButton
        rule={RULES[3]}
        active={activeRule === "kyc"}
        position="right-[5%] top-[58%]"
        onClick={() => toggleRule("kyc")}
      />

      {/* RULE 5 */}
      <RuleButton
        rule={RULES[4]}
        active={activeRule === "report"}
        position="left-1/2 bottom-[8%] -translate-x-1/2"
        onClick={() => toggleRule("report")}
      />

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{
              opacity: 0,
              scale: 0.88,
              y: 24,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              scale: 0.88,
              y: 24,
              filter: "blur(10px)",
            }}
            transition={{
              type: "spring",
              stiffness: 190,
              damping: 22,
            }}
            className="absolute bottom-[15%] left-1/2 z-[60] w-[min(92%,520px)] -translate-x-1/2"
          >
            <div className="relative rounded-[24px] border border-white/12 bg-black/90 p-5 shadow-[0_30px_100px_rgba(0,0,0,.75)] backdrop-blur-2xl">

              {/* Close */}
              <button
                onClick={() => setActiveRule(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white"
                aria-label="Close rule"
              >
                <X size={14} />
              </button>

              <div className="flex items-start gap-4 pr-8">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/5">
                  <active.Icon
                    size={21}
                    strokeWidth={1.6}
                    className="text-amber-400"
                  />
                </div>

                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-400">
                    Protection Rule
                  </div>

                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {active.title}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/60">
                {active.explanation}
              </p>

              <div className="mt-4">
                <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/35">
                  Warning Signs
                </div>

                <div className="mt-2 grid gap-1.5">
                  {active.redFlags.map((flag) => (
                    <div
                      key={flag}
                      className="flex items-start gap-2 text-xs leading-5 text-white/55"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-400/70" />
                      {flag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-3">
                <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                  Recommended Action
                </div>

                <p className="mt-1 text-xs leading-5 text-white/65">
                  {active.action}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom instruction */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.3em] text-white/25">
        Select a protection rule
      </div>

      {/* Safety notice */}
      <div className="pointer-events-none absolute bottom-[-22px] left-1/2 z-40 hidden -translate-x-1/2 text-center text-[9px] text-white/25 md:block">
        Never type your real PIN or OTP into UPI Shield.
      </div>
    </div>
  );
}

type RuleButtonProps = {
  rule: Rule;
  active: boolean;
  position: string;
  onClick: () => void;
};

function RuleButton({
  rule,
  active,
  position,
  onClick,
}: RuleButtonProps) {
  const Icon = rule.Icon;

  return (
    <motion.div
      className={`pointer-events-auto absolute z-40 ${position}`}
      animate={{
        scale: active ? 1.06 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <div className="flex flex-col items-center gap-2">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
            active
              ? "border-amber-400/50 bg-amber-400/10 shadow-[0_0_25px_rgba(245,158,11,.18)]"
              : "border-white/10 bg-black/60"
          }`}
        >
          <Icon
            size={14}
            strokeWidth={1.7}
            className={
              active
                ? "text-amber-400"
                : "text-white/55"
            }
          />
        </div>

        <PearlButton
          label={rule.label}
          onClick={onClick}
          aria-expanded={active}
        />
      </div>
    </motion.div>
  );
}