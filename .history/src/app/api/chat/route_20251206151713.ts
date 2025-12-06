import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    console.log("📨 Received message:", message);

    // ✅ NEW ENDPOINT
    const response = await fetch(
      "https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<s>[INST] You are a helpful AI librarian assistant. Answer questions about books, studying, and learning. Keep responses concise and friendly.

User: ${message} [/INST]`,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false,
          },
        }),
      }
    );

    console.log("📡 HF Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ HF Error:", errorText);
      return NextResponse.json({ 
        answer: "Sorry, the AI is currently unavailable. Please try again." 
      });
    }

    const data = await response.json();
    console.log("📦 HF Response:", data);

    let answer = "🤖 Librarian is thinking...";

    if (Array.isArray(data) && data[0]?.generated_text) {
      answer = data[0].generated_text.trim();
    } else if (data?.generated_text) {
      answer = data.generated_text.trim();
    } else if (data?.error) {
      console.error("API Error:", data.error);
      answer = "Sorry, I'm having trouble right now. Please try again in a moment.";
    }

    console.log("🤖 Final answer:", answer);

    return NextResponse.json({ answer: answer });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ 
      answer: "Sorry, something went wrong. Please try again." 
    }, { status: 500 });
  }
}