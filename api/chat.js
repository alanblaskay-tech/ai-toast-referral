import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message, conversation = [] } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    const messages = [
      {
        role: "system",
        content: `
You are Sarah, a friendly and persuasive AI marketing assistant for Toast referrals.
Your goals:
- Answer all questions about Toast, its benefits, and referral signup.
- Encourage users to use the referral link: http://refer.toasttab.com/referred-by/AlanBlaskay/
- Keep responses concise, friendly, professional, and persuasive.
- Maintain the conversation context if multiple messages are sent.
- Always identify yourself as Sarah.
`
      },
      ...conversation,
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
      conversation: [...conversation, { role: "user", content: message }, { role: "assistant", content: response.choices[0].message.content }]
    });
  } catch (err) {
    console.error("AI bot error:", err);
    res.status(500).json({ error: "AI bot error" });
  }
}
