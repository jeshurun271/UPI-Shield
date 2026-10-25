import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const HOST = "127.0.0.1";
const PORT = 3001;
const MODEL = "gemini-3.8-flash";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
    res.json({
        ok: true,
        aiConfigured: Boolean(process.env.GEMINI_API_KEY),
        model: MODEL
    });
});

app.post("/api/chat", async (req, res) => {
    const message =
        typeof req.body?.message === "string"
            ? req.body.message.trim()
            : "";

    if (!message) {
        return res.status(400).json({
            error: "Please enter a message."
        });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing from backend/.env");
        return res.status(500).json({
            error: "Missing GEMINI_API_KEY in backend/.env."
        });
    }

    const suppliedHistory = Array.isArray(req.body?.history)
        ? req.body.history
        : [];

    let history = suppliedHistory
        .filter(item =>
            item &&
            (item.role === "user" || item.role === "model") &&
            typeof item.text === "string" &&
            item.text.trim()
        )
        .slice(-12)
        .map(item => ({
            role: item.role,
            parts: [{ text: item.text }]
        }));

    while (history.length && history[0].role === "model") {
        history.shift();
    }

    const contents = [
        ...history,
        {
            role: "user",
            parts: [{ text: message }]
        }
    ];

    try {
        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    maxOutputTokens: 2048
                }
            }),
            signal: AbortSignal.timeout(90000)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const detail =
                data?.error?.message ||
                `Google API returned HTTP ${response.status}.`;

            console.error(`[Gemini API error ${response.status}] ${detail}`);

            return res.status(502).json({
                error: `Gemini API error (${response.status}): ${detail}`
            });
        }

        const reply = (data?.candidates?.[0]?.content?.parts || [])
            .map(part => typeof part.text === "string" ? part.text : "")
            .join("")
            .trim();

        if (!reply) {
            return res.status(502).json({
                error: "Gemini returned no text. Please try again."
            });
        }

        return res.json({ reply });

    } catch (error) {
        console.error("[Gemini network error]", error?.message || String(error));

        return res.status(502).json({
            error: "Could not reach Gemini. Check your internet connection and AI server logs."
        });
    }
});

app.listen(PORT, HOST, () => {
    console.log(`AI server ready at http://${HOST}:${PORT}`);
    console.log(`Model: ${MODEL}`);
    console.log(`Gemini API key configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
});
