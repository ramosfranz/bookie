import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-base", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    });

    const data = await response.json();
    const answer = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text || "🤖 Librarian is thinking...";

    return NextResponse.json({ reply: answer });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch AI response" }, { status: 500 });
  }
}
