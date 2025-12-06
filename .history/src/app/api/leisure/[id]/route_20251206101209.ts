import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// Define type for your table row
interface LeisureRow {
  id: string;
  user_id: string;
  book_id: string;
  title: string;
  progress?: number;
  status?: string;
}

// GET handler
export async function GET(
  _req: NextRequest,
  context: { params: { id: string | Promise<string> } }
) {
  try {
    const id = await context.params.id;

    let query = supabase.from<LeisureRow>("leisure_library").select("*");
    if (id && id !== "all") query = query.eq("id", id);

    const { data, error } = await query;

    if (error) return NextResponse.json({ success: false, error: error.message });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ success: false, error: message });
  }
}

// POST handler
export async function POST(req: NextRequest) {
  try {
    const body: Omit<LeisureRow, "id"> = await req.json();

    const { data, error } = await supabase
      .from<LeisureRow>("leisure_library")
      .insert([body])
      .select();

    if (error) return NextResponse.json({ success: false, error: error.message });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ success: false, error: message });
  }
}

// PUT handler
export async function PUT(
  req: NextRequest,
  context: { params: { id: string | Promise<string> } }
) {
  try {
    const id = await context.params.id;
    const body: Partial<Omit<LeisureRow, "id">> = await req.json();

    const { data, error } = await supabase
      .from<LeisureRow>("leisure_library")
      .update(body)
      .eq("id", id)
      .select();

    if (error) return NextResponse.json({ success: false, error: error.message });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ success: false, error: message });
  }
}

// DELETE handler
export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string | Promise<string> } }
) {
  try {
    const id = await context.params.id;

    const { data, error } = await supabase
      .from<LeisureRow>("leisure_library")
      .delete()
      .eq("id", id)
      .select();

    if (error) return NextResponse.json({ success: false, error: error.message });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ success: false, error: message });
  }
}
