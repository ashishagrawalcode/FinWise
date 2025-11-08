import type { RequestHandler } from "express";

export const handleCoach: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body as { message?: string };
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message" });
    }

    // If no API key, return a graceful fallback
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.json({ reply: "AI is not configured yet. Please set OPENAI_API_KEY on the server." });
    }

    // Call OpenAI Chat Completions (Node 18+ has global fetch)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are FinWise AI Coach. Answer concisely about personal finance. Currency is INR by default." },
          { role: "user", content: message },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "AI provider error", details: text.slice(0, 2000) });
    }
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a reply.";
    return res.json({ reply });
  } catch (error: any) {
    return res.status(500).json({ error: "Server error", details: error?.message });
  }
};


