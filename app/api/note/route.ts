import { db } from "@/drizzle";
import { notes, users } from "@/drizzle/schema/user";
import { genAI } from "@/lib/gemini";
import { logger } from "@/lib/logger";
import { eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const body = await request.json();
	try {
		// For embeddings, use the embedding-001 model
		const model = genAI.getGenerativeModel({ model: "embedding-001" });

		const result = await model.embedContent(body.fileContent);
		const embedding = result.embedding;

		logger.info(`Embedding: ${embedding.values}`);

		const note = await db
			.insert(notes)
			.values({
				title: body.title,
				desc: body.desc,
				subject_name: body.subjectName,
				author_id: body.authorId,
				file_url: body.fileURL,
				embedding: embedding.values,
				is_verified: false,
			})
			.returning({ returningId: notes.id });

		await db
			.update(users)
			.set({
				points: sql`${users.points} + 10`,
			})
			.where(eq(users.id, body.authorId));

		// return note[0]?.returningId as string;
		return NextResponse.json(
			{
				data: note[0]?.returningId as string,
			},
			{
				status: 201,
			},
		);
	} catch (err) {
		if (err instanceof Error) {
			logger.error(err.message);
		}

		if (typeof err === "string") {
			logger.error(err);
		}

		logger.error(err);

		return NextResponse.json(
			{
				error: "Failed to create note",
			},
			{
				status: 500,
			},
		);
	}
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("type");

	switch (query) {
		case "unverified": {
			const unverified_notes = await db
				.select({
					id: notes.id,
					title: notes.title,
					desc: notes.desc,
					subject_name: notes.subject_name,
					file_url: notes.file_url,
				})
				.from(notes)
				.where(eq(notes.is_verified, false));
			return NextResponse.json({ data: unverified_notes }, { status: 200 });
		}
		case "verified": {
			const verified_notes = await db
				.select({
					id: notes.id,
					title: notes.title,
					desc: notes.desc,
					subject_name: notes.subject_name,
					file_url: notes.file_url,
				})
				.from(notes)
				.where(eq(notes.is_verified, true));
			return NextResponse.json({ data: verified_notes }, { status: 200 });
		}
		default: {
			const all_notes = await db
				.select({
					id: notes.id,
					title: notes.title,
					desc: notes.desc,
					subject_name: notes.subject_name,
					file_url: notes.file_url,
				})
				.from(notes);
			return NextResponse.json({ data: all_notes }, { status: 200 });
		}
	}
}
