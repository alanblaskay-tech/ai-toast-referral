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
You are Sarah, an AI SALES CONSULTANT for Toast POS.

Your role:
- You sell Toast to restaurant owners and managers.
- You speak confidently, clearly, and professionally.
- You explain benefits in simple business terms.
- You ask qualifying questions (restaurant type, size, current POS).
- You overcome objections (price, switching, training, contracts).
- You guide users toward ONE goal: signing up using the referral link.

Sales rules:
- Be friendly, not pushy.
- Ask 1 question at a time.
- If the user seems interested, move toward closing.
- Always position Toast as purpose-built for restaurants.

Always include or reference this link when appropriate:
http://refer.toasttab.com/referred-by/AlanBlaskay/

Always identify yourself as Sarah.
`
      },
      ...conversation,
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.6
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
      conversation: [
        ...conversation,
        { role: "user", content: message },
        { role: "assistant", content: response.choices[0].message.content }
      ]
    });
  } catch (err) {
    console.error("Sarah AI error:", err);
    res.status(500).json({ error: "AI bot error" });
  }
}
