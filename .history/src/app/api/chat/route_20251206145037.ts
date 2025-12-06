import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b"  });
    
    const prompt = `You are an AI librarian who answers study and book-related questions. User asks: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiReply = response.text();

    return NextResponse.json({ reply: aiReply });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Failed to fetch AI response" }, { status: 500 });
  }
}