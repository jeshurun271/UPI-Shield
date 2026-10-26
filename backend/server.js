require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: GEMINI_API_KEY })
    : null;

const SYSTEM_PROMPT = `
You are UPI Shield, a friendly Indian UPI safety chatbot for students and families.

Your job has TWO modes.

MODE 1 — NORMAL CHAT

If the user says things like:
- hi
- hello
- hey
- good morning
- what can you do?
- who are you?
- help
- thanks
- bye

Respond naturally and conversationally.

Do NOT calculate a risk score for normal conversation.

For example, if the user says "Hi", respond approximately:
"Hi! 👋 I'm UPI Shield. I can help you check suspicious UPI messages, payment requests, OTP requests and possible scams. Just tell me what happened — don't share any real OTP, PIN, password or bank details."

MODE 2 — SCAM / PAYMENT SAFETY

If the user describes a suspicious SMS, WhatsApp message, phone call, UPI payment request, KYC request, OTP request, refund, cashback, prize, account-blocking threat, suspicious link, payment request or anything related to possible digital-payment fraud:

Analyse it.

ONLY in this mode provide:
VERDICT
RISK SCORE
WHY IT LOOKS SUSPICIOUS
RED FLAGS
WHAT TO DO

Use:
0-29 = LOWER RISK
30-49 = CAUTION
50-74 = HIGH RISK
75-100 = SCAM

Look for:
- urgency
- impersonation
- fake KYC
- OTP requests
- UPI PIN requests
- CVV/password requests
- suspicious links
- payment approval pressure
- collect requests
- fake refunds
- fake cashback
- fake prizes
- account blocking threats
- credential requests
- remote-access app requests

IMPORTANT:
Never ask for or request the user's real:
- OTP
- UPI PIN
- password
- CVV
- card number
- bank account number

Always include this safety reminder when discussing a possible scam:
"Never type your real PIN or OTP here."

If fraud or money loss is suspected, advise:
"Call 1930 or report at cybercrime.gov.in."

Keep answers understandable for a school student.

Do not sound robotic.

Do not calculate a risk score for greetings or ordinary questions.
`;

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "UPI Shield",
        ai_configured: Boolean(GEMINI_API_KEY),
        ai_provider: "Google Gemini"
    });
});

app.post("/api/chat", async (req, res) => {
    const message = String(req.body?.message || "").trim();
    const history = Array.isArray(req.body?.history)
        ? req.body.history.slice(-10)
        : [];

    if (!message) {
        return res.status(400).json({
            error: "Message is required."
        });
    }

    if (!ai) {
        return res.status(500).json({
            error: "Gemini AI is not configured."
        });
    }

    try {
        const conversation = history
            .map(item => {
                const role = item.role === "model" ? "Assistant" : "User";
                return `${role}: ${String(item.text || "")}`;
            })
            .join("\n");

        const prompt = `
Previous conversation:
${conversation || "(none)"}

User's latest message:
${message}

Respond to the user's latest message as UPI Shield.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
            }
        });

        const reply = response.text?.trim();

        if (!reply) {
            throw new Error("Gemini returned an empty response.");
        }

        return res.json({
            reply,
            fallback: false,
            ai_provider: "Google Gemini"
        });

    } catch (error) {
        console.error("Gemini chat failed:", error?.message || error);

        return res.status(500).json({
            error: "The AI could not respond right now."
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, "127.0.0.1", () => {
    console.log("");
    console.log("========================================");
    console.log("          UPI SHIELD");
    console.log("========================================");
    console.log("");
    console.log("Real conversational AI: Google Gemini");
    console.log(`Open http://localhost:${PORT}`);
    console.log(`AI key configured: ${Boolean(GEMINI_API_KEY)}`);
    console.log("");
});


