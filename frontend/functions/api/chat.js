const SYSTEM_PROMPT = `
You are UPI Shield, a friendly Indian UPI safety chatbot for students and families.

You have TWO modes.

MODE 1 — NORMAL CHAT
If the user says hi, hello, hey, good morning, what can you do, who are you, help, thanks, bye, etc:
Respond naturally and conversationally.
Do NOT calculate a risk score for normal conversation.

MODE 2 — SCAM / PAYMENT SAFETY
If the user describes a suspicious SMS, WhatsApp message, phone call, UPI payment request, KYC request, OTP request, refund, cashback, prize, account-blocking threat, suspicious link, payment request or possible digital-payment fraud:

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

Never ask for:
- OTP
- UPI PIN
- password
- CVV
- card number
- bank account number

Always include:
"Never type your real PIN or OTP here."

If fraud or money loss is suspected, advise:
"Call 1930 or report at cybercrime.gov.in."

Keep answers understandable for a school student.
Do not sound robotic.
Do not calculate a risk score for greetings or ordinary questions.
`;

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const message = String(body?.message || "").trim();

    const history = Array.isArray(body?.history)
      ? body.history.slice(-10)
      : [];

    if (!message) {
      return Response.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini AI is not configured." },
        { status: 500 }
      );
    }

    const conversation = history
      .map((item) => {
        const role =
          item?.role === "model"
            ? "Assistant"
            : "User";

        return `${role}: ${String(item?.text || "")}`;
      })
      .join("\n");

    const prompt = `
Previous conversation:
${conversation || "(none)"}

User's latest message:
${message}

Respond to the user's latest message as UPI Shield.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" +
        encodeURIComponent(apiKey),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: SYSTEM_PROMPT,
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Gemini API error:",
        response.status,
        errorText
      );

      return Response.json(
        { error: "The AI could not respond right now." },
        { status: 502 }
      );
    }

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("")
        .trim();

    if (!reply) {
      return Response.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      );
    }

    return Response.json({
      reply,
      fallback: false,
      ai_provider: "Google Gemini",
    });
  } catch (error) {
    console.error(
      "UPI Shield AI error:",
      error?.message || error
    );

    return Response.json(
      { error: "The AI could not respond right now." },
      { status: 500 }
    );
  }
}