import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

       console.log("🔑 API Key exists:", !!process.env.HF_API_KEY);
    console.log("🔑 API Key prefix:", process.env.HF_API_KEY?.substring(0, 7));
    console.log("📨 Received message:", message);

    const completion = await client.chat.completions.create({
      model: "moonshotai/Kimi-K2-Instruct-0905",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI librarian assistant. Answer questions about books, studying, and learning. Keep responses concise and friendly.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const answer = completion.choices[0]?.message?.content || "🤖 Librarian is thinking...";
    console.log("🤖 AI Response:", answer);

    return NextResponse.json({ answer: answer });
  } catch (error: any) {
    console.error("❌ HF API Error:", error);
    return NextResponse.json({ 
      answer: "Sorry, I'm having trouble right now. Please try again." 
    }, { status: 500 });
  }
}