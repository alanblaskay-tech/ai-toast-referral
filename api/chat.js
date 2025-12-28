import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res){
  const { message } = req.body;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages:[
      { role:"system", content:"You are a helpful AI salesperson for Toast referrals." },
      { role:"user", content: message }
    ]
  });
  res.status(200).json({ reply: response.choices[0].message.content });
}
