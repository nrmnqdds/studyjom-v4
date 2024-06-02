import { GetObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";

import { r2Client } from "@/lib/r2";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const filename = body.filename;

	if (!filename) {
		return NextResponse.json(
			{ error: "filename is required" },
			{ status: 400 },
		);
	}

	try {
		const pdf = await r2Client.send(
			new GetObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: filename,
			}),
		);

		if (!pdf) {
			// throw new Error("file not found.");
			return NextResponse.json(
				{
					error: "file not found.",
				},
				{
					status: 404,
				},
			);
		}

		return new Response(pdf.Body?.transformToWebStream());
	} catch (err) {
		console.log("error", err);
	}
}
