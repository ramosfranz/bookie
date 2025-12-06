import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI librarian who answers study and book-related questions." },
        { role: "user", content: message },
      ],
      max_tokens: 300,
    });

    const aiReply = completion.choices[0].message?.content;

    return NextResponse.json({ reply: aiReply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json({ error: "Failed to fetch AI response" }, { status: 500 });
  }
}
