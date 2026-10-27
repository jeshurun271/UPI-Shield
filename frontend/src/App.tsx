import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import OptimizedTiltCard from "./components/ui/optimized-tilt-card";
import {
  AlertTriangle,
  BookOpen,
  ExternalLink,
  HelpCircle,
  Image,
  ListChecks,
  MessageCircle,
  Phone,
  ShieldCheck,
  Siren,
  XCircle,
  CheckCircle2,
  Gift,
  UserRound,
} from "lucide-react";

import MorphOrb from "./components/ui/ai-thiking-orb-and-input";
import { CircleMenu } from "./components/ui/circle-menu";
import { AgenticFactory3D } from "./components/agentic/AgenticFactory3D";
import LiquidMetalShader from "./components/ui/liquid-metal-shader";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

const API_URL = "/api/chat";

const STARTER_MESSAGE: ChatMessage = {
  role: "model",
  text:
    "Hi! I'm UPI Shield. I can help you check suspicious UPI messages, payment requests, OTP requests and possible scams.\n\nJust tell me what happened — don't share any real OTP, UPI PIN, password or bank details.",
};

const QUIZ_QUESTIONS = [
  {
    question:
      "Someone says they need your UPI PIN to transfer money into your account. What should you do?",
    options: [
      "Give them the PIN",
      "Ask them for their PIN",
      "Refuse and never share your UPI PIN",
      "Share it only if they sound trustworthy",
    ],
    answer: 2,
    explanation:
      "A UPI PIN authorises payments. You never need to enter it to receive money.",
  },
  {
    question:
      "You receive a message saying your bank account will be blocked today unless you complete KYC using a link. What should you do?",
    options: [
      "Click the link immediately",
      "Forward the link to friends",
      "Verify through your bank's official app or website",
      "Reply with your OTP",
    ],
    answer: 2,
    explanation:
      "Urgent KYC messages and unknown links are common scam tactics.",
  },
  {
    question:
      "A stranger sends you a UPI Collect request. You were not expecting any payment. What should you do?",
    options: [
      "Approve it",
      "Reject it",
      "Approve it and check later",
      "Send them your UPI PIN",
    ],
    answer: 1,
    explanation:
      "Never approve a payment request you did not initiate or expect.",
  },
  {
    question:
      "Someone calls claiming to be from your bank and asks for your OTP. What should you do?",
    options: [
      "Tell them the OTP",
      "Read only the first few digits",
      "Refuse and end the call",
      "Ask them to call again",
    ],
    answer: 2,
    explanation:
      "Bank staff should not ask you to reveal your OTP.",
  },
  {
    question:
      "You receive a message saying you have won a ?50,000 cashback prize and must pay ?500 to claim it. What is this?",
    options: [
      "A normal cashback process",
      "A likely scam",
      "A bank promotion",
      "A UPI reward",
    ],
    answer: 1,
    explanation:
      "Paying money to receive a supposed prize is a major scam warning sign.",
  },
  {
    question:
      "A caller asks you to install a remote-access app so they can help fix your banking problem. What should you do?",
    options: [
      "Install it",
      "Install it only temporarily",
      "Do not install it",
      "Give them your phone password",
    ],
    answer: 2,
    explanation:
      "Remote-access apps can allow scammers to view or control your device.",
  },
  {
    question:
      "Someone tells you that you must scan a QR code to receive money. What should you remember?",
    options: [
      "Scanning always receives money",
      "Scanning a QR code can lead to a payment",
      "QR codes are always safe",
      "You should enter your UPI PIN after scanning any QR",
    ],
    answer: 1,
    explanation:
      "A QR code can be used to make a payment. Never enter your PIN just to receive money.",
  },
  {
    question:
      "You get an SMS saying your parcel is stuck and asks you to pay ?20 using an unfamiliar link. What should you do?",
    options: [
      "Click the link",
      "Pay quickly",
      "Verify the delivery through the official courier website",
      "Enter your card details",
    ],
    answer: 2,
    explanation:
      "Fake delivery messages often use small payment amounts and suspicious links.",
  },
  {
    question:
      "A person says they accidentally sent ?5,000 to your UPI account and asks you to send it back to another number. What should you do?",
    options: [
      "Send it immediately",
      "Verify the transaction in your bank app first",
      "Ask for their OTP",
      "Send double the amount",
    ],
    answer: 1,
    explanation:
      "Never rely only on screenshots or messages. Verify actual transactions in your bank or UPI app.",
  },
  {
    question:
      "A caller creates urgency and says you will lose your account unless you act within five minutes. What is the biggest red flag?",
    options: [
      "The caller is polite",
      "The caller knows your name",
      "Pressure and urgency",
      "The call is during the day",
    ],
    answer: 2,
    explanation:
      "Scammers commonly create panic so victims act before verifying.",
  },
  {
    question:
      "Someone sends you a shortened URL asking you to update your banking details. What should you do?",
    options: [
      "Open it",
      "Enter only your name",
      "Avoid it and use the official bank website or app",
      "Forward it to your family",
    ],
    answer: 2,
    explanation:
      "Unexpected shortened or suspicious links can lead to phishing pages.",
  },
  {
    question:
      "Which information should you NEVER share with a stranger claiming to help with a UPI payment?",
    options: [
      "Your favourite colour",
      "Your UPI PIN or OTP",
      "The weather",
      "Your first name",
    ],
    answer: 1,
    explanation:
      "Never share your UPI PIN, OTP, password, CVV or other sensitive banking credentials.",
  },
  {
    question:
      "You accidentally approved a fraudulent UPI payment. What should you do first?",
    options: [
      "Ignore it",
      "Wait several days",
      "Contact your bank and report the fraud immediately",
      "Delete the UPI app",
    ],
    answer: 2,
    explanation:
      "Quick reporting can help with fraud response. Suspected cyber financial fraud can also be reported through 1930.",
  },
  {
    question:
      "Which behaviour is safest when receiving an unexpected payment request?",
    options: [
      "Approve it quickly",
      "Pause and verify",
      "Trust the caller",
      "Share your OTP",
    ],
    answer: 1,
    explanation:
      "Pause, verify the request and only approve payments you genuinely intend to make.",
  },
  {
    question:
      "What is the best general rule when someone pressures you to make a digital payment?",
    options: [
      "Pay quickly to avoid trouble",
      "Trust anyone claiming to be from a bank",
      "Stop, verify independently and never share your PIN or OTP",
      "Give them remote access to your phone",
    ],
    answer: 2,
    explanation:
      "Stop. Verify independently. Never share your UPI PIN, OTP or passwords.",
  },
] as const;

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    STARTER_MESSAGE,
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const historyRef = useRef<ChatMessage[]>([]);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizFinalScore, setQuizFinalScore] = useState(0);

  /*
   * =========================================================
   * CINEMATIC CHAT WELCOME
   * =========================================================
   */

  const [welcomeOpacity, setWelcomeOpacity] = useState(1);

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  /*
   * =========================================================
   * MOUSE PARALLAX + WELCOME FADE
   * =========================================================
   */

  useEffect(() => {
    let frame = 0;

    const handleMouseMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const x =
          (event.clientX / window.innerWidth - 0.5) * 2;

        const y =
          (event.clientY / window.innerHeight - 0.5) * 2;

        setMousePosition({
          x: x * 10,
          y: y * 7,
        });
      });
    };

    const handleTyping = (event: Event) => {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        setWelcomeOpacity((current) =>
          Math.max(0, current - 0.08),
        );
      }
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove,
    );

    document.addEventListener(
      "input",
      handleTyping,
    );

    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener(
        "mousemove",
        handleMouseMove,
      );

      document.removeEventListener(
        "input",
        handleTyping,
      );
    };
  }, []);

  /*
   * =========================================================
   * FADE WELCOME WHEN MORPHORB INPUT IS USED
   * =========================================================
   */

  useEffect(() => {
    const attachToMorphInput = () => {
      const field =
        document.querySelector<HTMLInputElement>(".mo-field");

      if (!field) {
        return;
      }

      const fadeWelcome = () => {
        setWelcomeOpacity(0);
      };

      field.addEventListener("focus", fadeWelcome);
      field.addEventListener("input", fadeWelcome);

      return () => {
        field.removeEventListener("focus", fadeWelcome);
        field.removeEventListener("input", fadeWelcome);
      };
    };

    const cleanup = attachToMorphInput();

    return () => {
      cleanup?.();
    };
  }, []);
  /*
   * =========================================================
   * FADE WELCOME WHEN MORPHORB INPUT IS USED
   * =========================================================
   */

  useEffect(() => {
    const attachToMorphInput = () => {
      const field =
        document.querySelector<HTMLInputElement>(".mo-field");

      if (!field) {
        return;
      }

      const fadeWelcome = () => {
        setWelcomeOpacity(0);
      };

      field.addEventListener("focus", fadeWelcome);
      field.addEventListener("input", fadeWelcome);

      return () => {
        field.removeEventListener("focus", fadeWelcome);
        field.removeEventListener("input", fadeWelcome);
      };
    };

    const cleanup = attachToMorphInput();

    return () => {
      cleanup?.();
    };
  }, []);
  /*
   * =========================================================
   * PREVENT ACCIDENTAL ZOOM
   * =========================================================
   */

  useEffect(() => {
    const preventWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    const preventTouch = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    window.addEventListener(
      "wheel",
      preventWheel,
      {
        passive: false,
      },
    );

    window.addEventListener(
      "touchmove",
      preventTouch,
      {
        passive: false,
      },
    );

    return () => {
      window.removeEventListener(
        "wheel",
        preventWheel,
      );

      window.removeEventListener(
        "touchmove",
        preventTouch,
      );
    };
  }, []);

  /*
   * =========================================================
   * AI CHAT
   * =========================================================
   */

  const askAI = async (
    message: string,
  ): Promise<string> => {
    const cleanMessage = message.trim();

    if (!cleanMessage || loading) {
      return "";
    }

    const userMessage: ChatMessage = {
      role: "user",
      text: cleanMessage,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: cleanMessage,
          history:
            historyRef.current.slice(-10),
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`,
        );
      }

      const data = await response.json();

      const reply =
        typeof data.reply === "string" &&
        data.reply.trim()
          ? data.reply.trim()
          : "I couldn't analyse that right now. Please try again.";

      const modelMessage: ChatMessage = {
        role: "model",
        text: reply,
      };

      setMessages((previous) => [
        ...previous,
        modelMessage,
      ]);

      historyRef.current = [
        ...historyRef.current,
        userMessage,
        modelMessage,
      ].slice(-12);

      return reply;
    } catch (error) {
      console.error(
        "[UPI Shield AI]",
        error,
      );

      const errorMessage: ChatMessage = {
        role: "model",
        text:
          "I couldn't connect to the UPI Shield AI service.\n\nPlease make sure the backend is running on port 3000.",
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);

      return errorMessage.text;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await askAI(input);
  };

  /*
   * =========================================================
   * QUIZ
   * =========================================================
   */

  const handleQuizAnswer = (
    selected: number,
  ) => {
    if (
      quizAnswered ||
      quizFinished
    ) {
      return;
    }

    const question =
      QUIZ_QUESTIONS[quizIndex];

    const correct =
      selected === question.answer;

    setQuizSelected(selected);
    setQuizAnswered(true);

    const newScore =
      quizScore +
      (correct ? 1 : 0);

    if (correct) {
      setQuizScore(newScore);
    }

    setTimeout(() => {
      if (
        quizIndex ===
        QUIZ_QUESTIONS.length - 1
      ) {
        setQuizFinalScore(
          newScore,
        );

        setQuizFinished(true);
      } else {
        setQuizIndex(
          (current) =>
            current + 1,
        );

        setQuizSelected(null);
        setQuizAnswered(false);
      }
    }, 900);
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizSelected(null);
    setQuizAnswered(false);
    setQuizFinished(false);
    setQuizFinalScore(0);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* =========================================================
          HERO / CHAT
      ========================================================= */}

      <section
        id="chat"
        className="relative min-h-screen w-full overflow-hidden bg-black"
      >

        {/* =====================================================
            LIQUID METAL BACKDROP
            CHATBOT PAGE ONLY
        ===================================================== */}

        <div className="absolute inset-0 z-0">
          <LiquidMetalShader
            baseColor="#050505"
            metalColor="#707785"
            highlightColor="#ffffff"
            distortion={0.72}
            interactive={true}
            scale={1.05}
            speed={0.42}
            pixelRatio={1.25}
            className="h-full w-full"
          />
        </div>

        {/* Cinematic dark overlay */}

        <div className="pointer-events-none absolute inset-0 z-[1] bg-black/50" />

        {/* Subtle top-to-bottom gradient */}

        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/10 via-transparent to-black/35" />

        {/* =====================================================
            WELCOME MESSAGE
        ===================================================== */}

        <div
          className="pointer-events-none absolute left-1/2 top-[28%] z-10 text-center"
          style={{
            opacity: welcomeOpacity,

            transform:
              `translate(calc(-50% + ${mousePosition.x}px), ${mousePosition.y}px)`,

            transition:
              "opacity 1.4s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.42em] text-white/35">
            Welcome to
          </div>

          <div className="mt-3 text-4xl font-medium tracking-[-0.04em] text-white/85 md:text-5xl">
            UPI Shield
          </div>

          <div className="mt-3 whitespace-nowrap text-xs tracking-[0.18em] text-white/30">
            YOUR DIGITAL PAYMENT SAFETY COMPANION
          </div>
        </div>

        {/* =====================================================
            ORIGINAL MORPHORB CHATBOT
        ===================================================== */}

        <div className="relative z-10 min-h-screen w-full">
          <MorphOrb
            onSubmit={async (text) => {
              return await askAI(text);
            }}
          />
        </div>
      </section>

      {/* =========================================================
          LEARN
      ========================================================= */}

      <section
        id="learn"
        className="min-h-screen border-t border-border px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <div className="flex items-center gap-3">
            <BookOpen size={28} />

            <h2 className="text-3xl font-semibold md:text-4xl">
              Learn UPI Safety
            </h2>
          </div>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Most digital-payment scams rely on urgency,
            impersonation, deception and getting victims
            to approve something they did not intend to approve.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <SafetyCard
              title="Never share OTP"
              text="A genuine bank or payment service should never ask you to reveal your OTP."
            />

            <SafetyCard
              title="Never share UPI PIN"
              text="Your UPI PIN is used to authorise payments. You never need it to receive money."
            />

            <SafetyCard
              title="Stop and verify"
              text="If someone creates urgency, pause and verify through the official bank or app."
            />

            <SafetyCard
              title="Don't click unknown links"
              text="Avoid links received through unexpected SMS, WhatsApp or social-media messages."
            />

            <SafetyCard
              title="Reject suspicious requests"
              text="Do not approve collect requests or payment requests you did not initiate."
            />

            <SafetyCard
              title="Never install remote-access apps"
              text="Scammers may ask you to install apps that let them control or view your device."
            />

          </div>
        </div>
      </section>

      {/* =========================================================
          QUIZ
      ========================================================= */}

      <section
        id="quiz"
        className="min-h-screen border-t border-border px-6 py-24"
      >
        <div className="mx-auto max-w-4xl">

          <div className="flex items-center gap-3">
            <HelpCircle size={28} />

            <h2 className="text-3xl font-semibold md:text-4xl">
              UPI Shield Safety Quiz
            </h2>
          </div>

          <p className="mt-3 text-muted-foreground">
            Test what you know about UPI scams. 15 questions. One at a time.
          </p>

          {!quizFinished ? (
            <div className="mt-10 rounded-3xl border border-border bg-muted/30 p-8">

              <div className="flex items-center justify-between gap-4">

                <span className="text-sm font-semibold text-muted-foreground">
                  Question {quizIndex + 1} of{" "}
                  {QUIZ_QUESTIONS.length}
                </span>

                <span className="text-sm font-semibold">
                  Score: {quizScore}
                </span>

              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">

                <div
                  className="h-full rounded-full bg-foreground transition-all duration-500"

                  style={{
                    width: `${
                      ((quizIndex + 1) /
                        QUIZ_QUESTIONS.length) *
                      100
                    }%`,
                  }}
                />

              </div>

              <div className="mt-10">

                <p className="text-xl font-semibold leading-relaxed md:text-2xl">
                  {
                    QUIZ_QUESTIONS[
                      quizIndex
                    ].question
                  }
                </p>

                <div className="mt-8 grid gap-3">

                  {QUIZ_QUESTIONS[
                    quizIndex
                  ].options.map(
                    (
                      option,
                      index,
                    ) => {

                      const isSelected =
                        quizSelected ===
                        index;

                      const isCorrect =
                        index ===
                        QUIZ_QUESTIONS[
                          quizIndex
                        ].answer;

                      let optionClass =
                        "border-border bg-background hover:bg-muted";

                      if (
                        quizAnswered &&
                        isCorrect
                      ) {
                        optionClass =
                          "border-green-500 bg-green-500/15";
                      } else if (
                        quizAnswered &&
                        isSelected &&
                        !isCorrect
                      ) {
                        optionClass =
                          "border-red-500 bg-red-500/15";
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={
                            quizAnswered
                          }

                          onClick={() =>
                            handleQuizAnswer(
                              index,
                            )
                          }

                          className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${optionClass} ${
                            !quizAnswered
                              ? "hover:-translate-y-0.5"
                              : ""
                          }`}
                        >

                          <span className="mr-3 font-bold">
                            {String.fromCharCode(
                              65 + index,
                            )}
                            .
                          </span>

                          {option}

                        </button>
                      );
                    },
                  )}

                </div>

                {quizAnswered && (
                  <div className="mt-6 rounded-2xl border border-border bg-background p-5">

                    <p className="font-semibold">
                      {quizSelected ===
                      QUIZ_QUESTIONS[
                        quizIndex
                      ].answer
                        ? "Correct!"
                        : "Not quite."}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {
                        QUIZ_QUESTIONS[
                          quizIndex
                        ].explanation
                      }
                    </p>

                    <p className="mt-3 text-xs text-muted-foreground">
                      Next question coming up...
                    </p>

                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-border bg-muted/30 p-10 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border text-2xl font-bold">
                {quizFinalScore}/15
              </div>

              <h3 className="mt-7 text-3xl font-semibold">

                {quizFinalScore >= 13
                  ? "Excellent!"
                  : quizFinalScore >= 10
                  ? "Great job!"
                  : quizFinalScore >= 7
                  ? "Good start!"
                  : "Keep learning!"}

              </h3>

              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                You scored{" "}
                <strong>
                  {quizFinalScore}
                </strong>{" "}
                out of{" "}
                <strong>
                  {QUIZ_QUESTIONS.length}
                </strong>.
              </p>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                Remember: never share your UPI PIN, OTP,
                password or other sensitive banking information.
                When something feels urgent or suspicious,
                stop and verify.
              </p>

              <button
                type="button"
                onClick={restartQuiz}
                className="mt-8 rounded-full border border-border bg-foreground px-7 py-3 text-sm font-semibold text-background transition hover:brightness-110"
              >
                Take the Quiz Again
              </button>

            </div>
          )}

        </div>
      </section>

      {/* =========================================================
          EMERGENCY
      ========================================================= */}

      <section
        id="emergency"
        className="min-h-screen border-t border-border px-6 py-24"
      >
        <div className="mx-auto max-w-5xl">

          <div className="flex items-center gap-3">

            <Siren size={30} />

            <h2 className="text-3xl font-semibold md:text-4xl">
              If You Have Lost Money
            </h2>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8">

              <Phone size={32} />

              <h3 className="mt-5 text-2xl font-semibold">
                Call 1930
              </h3>

              <p className="mt-3 text-muted-foreground">
                If you suspect financial cyber fraud or have lost money,
                contact the national cybercrime helpline immediately.
              </p>

              <a
                href="tel:1930"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-background"
              >
                Call 1930
                <Phone size={16} />
              </a>

            </div>

            <div className="rounded-3xl border border-border bg-muted/30 p-8">

              <ExternalLink size={32} />

              <h3 className="mt-5 text-2xl font-semibold">
                Report Online
              </h3>

              <p className="mt-3 text-muted-foreground">
                Report cybercrime through the official Government of India
                cybercrime portal.
              </p>

              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3"
              >
                cybercrime.gov.in
                <ExternalLink size={16} />
              </a>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          UPI SHIELD RULES / SPLINE 3D
      ========================================================= */}

      <section
        id="safety"
        className="relative min-h-screen overflow-hidden border-t border-border bg-black"
      >

        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 pb-8 pt-20 md:px-8">

          <div className="mb-6 text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
              UPI SHIELD / INTERACTIVE SAFETY SYSTEM
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-6xl">
              UPI Shield Rules
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/55 md:text-base">
              Explore the interactive 3D system and learn the simple rules
              that can protect you from UPI fraud.
            </p>

          </div>

          <div className="relative mt-6 min-h-[620px] overflow-hidden rounded-[28px] border border-white/10 bg-black">

            <AgenticFactory3D />

          </div>

          <div className="mt-5 text-center text-xs uppercase tracking-[0.2em] text-white/40">
            PIN & OTP · Suspicious Links · Payment Requests · Fake KYC ·
            Report Fraud
          </div>

          <div className="mt-4 text-center text-xs font-medium text-white/45">
            Never type your real PIN or OTP into UPI Shield.
          </div>

        </div>
      </section>

      {/* =========================================================
          15 SCAM SCENARIOS
      ========================================================= */}

      <section
        id="scenarios"
        className="min-h-screen border-t border-border px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <div className="flex items-center gap-3">

            <ListChecks size={30} />

            <h2 className="text-3xl font-semibold md:text-4xl">
              Common UPI Scam Scenarios
            </h2>

          </div>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            These are the types of situations UPI Shield is designed to help
            users recognise.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {[
              "Fake KYC update",
              "Fake bank representative",
              "UPI collect request",
              "Fake cashback",
              "Fake prize or lottery",
              "Refund scam",
              "Account-blocking threat",
              "QR-code payment scam",
              "Fake customer-care number",
              "Remote-access app scam",
              "Phishing link",
              "Investment scam",
              "Job scam",
              "Delivery/refund scam",
              "Impersonation scam",
            ].map(
              (
                scenario,
                index,
              ) => (
                <div
                  key={scenario}
                  className="rounded-2xl border border-border bg-muted/20 p-5"
                >

                  <span className="text-xs text-muted-foreground">
                    SCENARIO{" "}
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <h3 className="mt-2 font-semibold">
                    {scenario}
                  </h3>

                </div>
              ),
            )}

          </div>

        </div>
      </section>

      {/* =========================================================
          POSTER
      ========================================================= */}

      <section
        id="poster"
        className="scroll-mt-24 border-t border-border px-4 py-20 md:px-8"
      >
        <div className="mx-auto max-w-6xl">

          <div className="relative overflow-hidden rounded-[28px] border-[3px] border-black bg-[#f4efe3] text-black shadow-2xl">

            <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#000_0.7px,transparent_0.7px)] [background-size:7px_7px]" />

            <div className="relative p-6 md:p-10 lg:p-14">

              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

                <div>

                  <div className="inline-flex items-center gap-3">

                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black text-white">
                      <ShieldCheck size={32} />
                    </div>

                    <div>

                      <div className="text-4xl font-black tracking-[-0.06em] md:text-6xl">
                        UPI
                      </div>

                      <div className="-mt-2 bg-[#f2d400] px-2 text-4xl font-black tracking-[-0.06em] md:text-6xl">
                        SHIELD
                      </div>

                    </div>

                  </div>

                  <p className="mt-5 text-xl font-black uppercase tracking-wide md:text-2xl">
                    Think. Verify. Stay Safe.
                  </p>

                  <div className="mt-2 h-1 w-56 bg-red-600" />

                </div>

                <div className="rotate-2 bg-red-600 p-6 text-white shadow-lg">

                  <div className="text-3xl font-black uppercase leading-tight md:text-4xl">
                    SCAMS
                    <br />
                    LOOK REAL.
                  </div>

                  <div className="mt-2 text-2xl font-black uppercase">
                    Stay Smart.
                  </div>

                  <div className="mt-4 text-sm font-bold">
                    Same app.
                    <br />
                    Same UPI.
                    <br />
                    Different risks.
                  </div>

                </div>

              </div>

              <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1fr_0.9fr]">

                <div className="space-y-4">

                  <ScamMessage
                    icon={
                      <AlertTriangle size={22} />
                    }
                    text="Your UPI account will be blocked today. Share your OTP now!"
                  />

                  <ScamMessage
                    icon={
                      <Gift size={22} />
                    }
                    text="Congratulations! You won ?10,000 cashback. Click the link to claim."
                  />

                  <ScamMessage
                    icon={
                      <UserRound size={22} />
                    }
                    text="I'm from your bank. Share your UPI PIN to receive your refund."
                  />

                  <div className="rounded-2xl border-2 border-green-700 bg-green-50 p-4">

                    <div className="flex items-center gap-3">

                      <CheckCircle2
                        className="text-green-700"
                        size={24}
                      />

                      <div>

                        <p className="font-black">
                          ?2,500 received
                        </p>

                        <p className="text-sm font-semibold">
                          Verify inside your official UPI app.
                        </p>

                      </div>

                    </div>

                    <span className="mt-3 inline-block rounded border-2 border-green-700 px-2 py-1 text-xs font-black text-green-700">
                      REAL
                    </span>

                  </div>

                </div>

                <div className="flex items-center justify-center">

                  <div className="relative w-full max-w-[290px]">

                    <div className="absolute -left-4 top-10 h-16 w-16 rounded-full border-[3px] border-black bg-[#f2d400]" />

                    <div className="relative rotate-[-2deg] rounded-[40px] border-[6px] border-black bg-[#111] p-4 shadow-2xl">

                      <div className="mx-auto mb-5 h-2 w-20 rounded-full bg-gray-700" />

                      <div className="flex min-h-[430px] flex-col items-center justify-center rounded-[28px] bg-black px-5 text-white">

                        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-green-400 bg-green-400/10">

                          <ShieldCheck
                            size={78}
                            strokeWidth={1.7}
                            className="text-green-400"
                          />

                        </div>

                        <div className="mt-8 text-center">

                          <div className="text-4xl font-black tracking-tight">
                            UPI
                          </div>

                          <div className="text-3xl font-black text-green-400">
                            SHIELD
                          </div>

                          <p className="mt-6 text-xl font-black uppercase">
                            Same app.
                            <br />
                            Safer you.
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="absolute -right-5 bottom-8 rotate-[-8deg] bg-white px-4 py-3 text-sm font-black shadow-lg">
                      PAUSE.
                      <br />
                      VERIFY.
                    </div>

                  </div>

                </div>

                <div className="bg-[#f2d400] p-5 shadow-lg">

                  <div className="bg-black px-4 py-3 text-xl font-black text-white">
                    YOUR UPI SAFETY RULES
                  </div>

                  <PosterRule
                    danger
                    text="Never share your OTP."
                  />

                  <PosterRule
                    danger
                    text="Never share your UPI PIN."
                  />

                  <PosterRule
                    text="You don't need a PIN to receive money."
                  />

                  <PosterRule
                    danger
                    text="Don't click unknown links."
                  />

                  <PosterRule
                    text="Check the recipient name before paying."
                  />

                  <PosterRule
                    danger
                    text="Don't install remote-access apps."
                  />

                  <PosterRule
                    text="When in doubt, verify through your official bank or app."
                  />

                </div>

              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-3">

                <div className="rotate-[-1deg] bg-[#f5b6b6] p-6 shadow-md">

                  <p className="text-2xl font-black uppercase">
                    Scammers
                    <br />
                    create urgency.
                  </p>

                  <p className="mt-3 font-bold">
                    You create a pause.
                  </p>

                </div>

                <div className="rotate-[1deg] bg-[#c7d8e7] p-6 shadow-md">

                  <p className="text-2xl font-black uppercase">
                    Verify
                    <br />
                    before you pay.
                  </p>

                  <p className="mt-3 font-bold">
                    Never trust a caller just because they sound official.
                  </p>

                </div>

                <div className="rotate-[-1deg] bg-[#d8e5cf] p-6 shadow-md">

                  <p className="text-2xl font-black uppercase">
                    Protect
                    <br />
                    others.
                  </p>

                  <p className="mt-3 font-bold">
                    Teach your family and friends the same rules.
                  </p>

                </div>

              </div>

              <div className="mt-10 overflow-hidden rounded-2xl border-4 border-black bg-black text-white">

                <div className="flex flex-col items-center justify-between gap-5 px-6 py-7 md:flex-row md:px-10">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-600">
                      <Phone size={28} />
                    </div>

                    <div>

                      <p className="text-sm font-bold uppercase tracking-widest">
                        If you lose money
                      </p>

                      <p className="text-4xl font-black md:text-5xl">
                        CALL 1930
                      </p>

                    </div>

                  </div>

                  <div className="text-center md:text-right">

                    <p className="text-sm font-bold uppercase">
                      Report online
                    </p>

                    <p className="text-xl font-black">
                      cybercrime.gov.in
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t-2 border-black pt-6 text-sm font-black uppercase tracking-wide">

                <span>
                  Be Aware
                </span>

                <span>
                  •
                </span>

                <span>
                  Stay Informed
                </span>

                <span>
                  •
                </span>

                <span>
                  Protect Others
                </span>

                <span>
                  •
                </span>

                <span>
                  Use UPI Wisely
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          CIRCLE MENU
      ========================================================= */}

      <div className="fixed bottom-6 right-6 z-50">

        <CircleMenu
          items={[
            {
              label: "Chat",
              icon: (
                <MessageCircle size={16} />
              ),
              href: "#chat",
            },
            {
              label: "Learn",
              icon: (
                <BookOpen size={16} />
              ),
              href: "#learn",
            },
            {
              label: "Quiz",
              icon: (
                <HelpCircle size={16} />
              ),
              href: "#quiz",
            },
            {
              label: "Emergency",
              icon: (
                <Siren size={16} />
              ),
              href: "#emergency",
            },
            {
              label: "Safety",
              icon: (
                <ShieldCheck size={16} />
              ),
              href: "#safety",
            },
            {
              label: "15 Scams",
              icon: (
                <ListChecks size={16} />
              ),
              href: "#scenarios",
            },
            {
              label: "Poster",
              icon: (
                <Image size={16} />
              ),
              href: "#poster",
            },
          ]}
        />

      </div>

    </main>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function SafetyCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <OptimizedTiltCard className="rounded-3xl border border-border bg-muted/20 p-6">
      <ShieldCheck size={24} />

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {text}
      </p>
    </OptimizedTiltCard>
  );
} 
function ScamMessage({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-black/10 bg-white p-4 shadow-md">

      <div className="flex items-start gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          {icon}
        </div>

        <p className="text-sm font-semibold leading-6">
          {text}
        </p>

      </div>

      <div className="mt-3 inline-flex items-center gap-2 rounded border-2 border-red-600 px-2 py-1 text-xs font-black text-red-600">

        <XCircle size={14} />

        SCAM

      </div>

    </div>
  );
}

function PosterRule({
  text,
  danger = false,
}: {
  text: string;
  danger?: boolean;
}) {
  return (
    <div className="flex gap-3 border-b-2 border-black/20 py-4 last:border-b-0">

      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${
          danger
            ? "bg-red-600"
            : "bg-green-700"
        }`}
      >

        {danger ? (
          <XCircle size={18} />
        ) : (
          <CheckCircle2 size={18} />
        )}

      </div>

      <p className="text-sm font-black leading-5">
        {text}
      </p>

    </div>
  );
}

export default App;


