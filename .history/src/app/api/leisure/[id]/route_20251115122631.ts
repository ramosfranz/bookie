import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  let query = supabase.from("leisure_library").select("*");

  if (id && id !== "all") query = query.eq("id", id);

  const { data, error } = await query;

  if (error) return NextResponse.json({ success: false, error: error.message });

  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, book_id, title, progress, status } = body;

  const { data, error } = await supabase
    .from("leisure_library")
    .insert([{ user_id, book_id, title, progress, status }])
    .select();

  if (error) return NextResponse.json({ success: false, error: error.message });

  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("leisure_library")
    .update(body)
    .eq("id", id)
    .select();

  if (error) return NextResponse.json({ success: false, error: error.message });

  return NextResponse.json({ success: true, data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const { data, error } = await supabase
    .from("leisure_library")
    .delete()
    .eq("id", id)
    .select();

  if (error) return NextResponse.json({ success: false, error: error.message });

  return NextResponse.json({ success: true, data });
}
