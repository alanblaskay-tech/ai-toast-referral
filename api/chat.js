import OpenAI from "openai";

// Initialize OpenAI with your API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
You are Sarah, a friendly AI marketing assistant for Toast referrals.
Your job:
- Help users understand Toast and encourage signups via the referral link
- Always mention this referral link: http://refer.toasttab.com/referred-by/AlanBlaskay/
- Be friendly, concise, and professional
- Answer questions about benefits, rewards, and how to sign up
- Engage users naturally, as if you are a helpful assistant named Sarah
`
        },
        { role: "user", content: message }
      ],
      temperature: 0.7
    });

    res.status(200).json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("AI bot error:", err);
    res.status(500).json({ error: "AI bot error" });
  }
}
