import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    console.log("📨 Received message:", message);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    console.log("📡 HF Response status:", response.status);
    
    const data = await response.json();
    console.log("📦 HF Full response data:", JSON.stringify(data, null, 2));

    let answer = "🤖 Librarian is thinking...";
    
    if (Array.isArray(data)) {
      console.log("✅ Data is array");
      answer = data[0]?.generated_text || answer;
    } else if (data?.generated_text) {
      console.log("✅ Data has generated_text");
      answer = data.generated_text;
    } else if (data?.[0]?.generated_text) {
      console.log("✅ Data[0] has generated_text");
      answer = data[0].generated_text;
    } else {
      console.log("❌ No generated_text found");
    }

    console.log("🤖 Final answer:", answer);

    return NextResponse.json({ answer: answer });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json({ 
      answer: "Sorry, something went wrong." 
    }, { status: 500 });
  }
}
