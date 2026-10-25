require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })
    : null;

const frontendPath = path.join(__dirname, "..", "frontend");

app.use(express.static(frontendPath));

function localAnalyse(message) {
    const text = String(message || "").toLowerCase();
    const signals = [];

    function addSignal(name, explanation) {
        signals.push({
            name,
            explanation
        });
    }

    if (/urgent|immediately|now|today|within|expires|last chance/.test(text)) {
        addSignal(
            "URGENCY",
            "The message creates pressure to act quickly instead of giving you time to independently verify the request."
        );
    }

    if (/otp|one[- ]time password|verification code/.test(text)) {
        addSignal(
            "OTP REQUEST",
            "Legitimate organisations should not ask you to disclose an OTP to another person."
        );
    }

    if (/upi pin|pin|cvv|password|credentials|account details/.test(text)) {
        addSignal(
            "CREDENTIAL REQUEST",
            "The message appears to request sensitive financial or authentication information."
        );
    }

    if (/kyc|blocked|suspended|freeze|account will be/.test(text)) {
        addSignal(
            "KYC PRESSURE",
            "The message uses account suspension or KYC pressure to make the recipient act without verification."
        );
    }

    if (/cashback|reward|prize|winner|won|refund/.test(text)) {
        addSignal(
            "FINANCIAL INCENTIVE",
            "Unexpected rewards or refunds are commonly used to persuade people to interact with fraudulent payment flows."
        );
    }

    if (/http:\/\/|https:\/\/|www\.|\.com|\.in\/|bit\.ly|tinyurl/.test(text)) {
        addSignal(
            "SUSPICIOUS LINK",
            "The message contains a link. Unexpected links should be independently verified before opening."
        );
    }

    if (/approve|collect request|payment request|pay|send money|transfer/.test(text)) {
        addSignal(
            "PAYMENT PRESSURE",
            "The message appears to encourage a payment or payment approval."
        );
    }

    let score = Math.min(98, 18 + signals.length * 12);

    if (/otp|upi pin|cvv|password/.test(text)) {
        score += 12;
    }

    score = Math.min(score, 99);

    let verdict = "LOWER RISK";

    if (score >= 75) {
        verdict = "SCAM";
    } else if (score >= 50) {
        verdict = "HIGH RISK";
    } else if (score >= 30) {
        verdict = "CAUTION";
    }

    const explanation = signals.length
        ? `Shield detected ${signals.length} behavioural signal${signals.length === 1 ? "" : "s"} associated with potentially unsafe payment communication.`
        : "No major scam indicators were detected in the supplied message. This does not guarantee that the message is genuine.";

    let action;

    if (score >= 75) {
        action =
            "Do not click the link, approve the payment or share any OTP/UPI PIN. Verify directly through your bank's official app or website.";
    } else if (score >= 50) {
        action =
            "Pause before acting. Independently verify the sender and request through an official channel.";
    } else {
        action =
            "No strong scam pattern was detected. Continue to verify unexpected payment requests independently.";
    }

    return {
        risk_score: score,
        verdict,
        explanation,
        why: explanation,
        recommended_action: action,
        signals
    };
}


app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "UPI Shield",
        ai_configured: Boolean(process.env.OPENAI_API_KEY)
    });
});


app.post("/api/upi-analyze", async (req, res) => {
    const message = String(req.body?.message || "").trim();

    if (!message) {
        return res.status(400).json({
            error: "Message is required."
        });
    }

    /*
     * AI analysis
     */
    if (openai) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                temperature: 0.1,
                response_format: {
                    type: "json_object"
                },
                messages: [
                    {
                        role: "system",
                        content: `
You are UPI Shield, an Indian digital-payment scam detection assistant.

Analyse suspicious SMS, WhatsApp messages, payment requests and scam messages.

Return ONLY valid JSON using this structure:

{
  "risk_score": 0,
  "verdict": "SCAM",
  "explanation": "short explanation",
  "why": "specific reasons",
  "recommended_action": "what the user should do",
  "signals": [
    {
      "name": "SIGNAL NAME",
      "explanation": "why this signal matters"
    }
  ]
}

Risk score:
0-29 = LOWER RISK
30-49 = CAUTION
50-74 = HIGH RISK
75-100 = SCAM

Look especially for:
- urgency
- impersonation
- fake KYC
- OTP requests
- UPI PIN requests
- suspicious links
- payment approval pressure
- fake refunds
- fake cashback
- account blocking threats
- credential requests

Never tell the user to share OTP, UPI PIN, CVV or passwords.
`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            });

            const content =
                response.choices?.[0]?.message?.content;

            if (content) {
                let result;

                try {
                    result = JSON.parse(content);
                } catch {
                    result = null;
                }

                if (result) {
                    return res.json({
                        result
                    });
                }
            }
        } catch (error) {
            console.error(
                "OpenAI analysis failed:",
                error?.message || error
            );
        }
    }

    /*
     * Local fallback
     */
    return res.json({
        result: localAnalyse(message),
        fallback: true
    });
});


app.get("*", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "index.html")
    );
});


app.listen(PORT, "127.0.0.1", () => {
    console.log("");
    console.log("========================================");
    console.log("          UPI SHIELD");
    console.log("========================================");
    console.log("");
    console.log(`UPI Shield is running locally.`);
    console.log(`Open http://localhost:${PORT}`);
    console.log(
        `AI key configured: ${Boolean(process.env.OPENAI_API_KEY)}`
    );
    console.log("");
    console.log("Keep this terminal open while using the app.");
    console.log("");
});
