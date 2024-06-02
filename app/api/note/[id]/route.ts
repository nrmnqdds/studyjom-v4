import { db } from "@/drizzle";
import { notes } from "@/drizzle/schema/user";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = params.id;

	const note = await db.select().from(notes).where(eq(notes.id, id));

	return NextResponse.json({ data: note[0] }, { status: 200 });
}
