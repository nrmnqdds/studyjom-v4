import { r2Client } from "@/lib/r2";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { createId } from "@paralleldrive/cuid2";
import { type NextRequest, NextResponse } from "next/server";
import { createWorker } from "tesseract.js";

async function uploadFileToS3(file: Buffer, fileName: string) {
	const fileBuffer = file;

	// Check file size
	const fileSizeInBytes = fileBuffer.byteLength;
	const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
	if (fileSizeInMB > 5) {
		throw new Error("File size is too large");
	}

	const params = {
		Body: fileBuffer,
		Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
		ContentType: "*/*",
		Key: `${createId()}-${fileName}`,
	};

	const command = new PutObjectCommand(params);

	await r2Client.send(command);
	return params.Key;
}

export async function POST(request: NextRequest) {
	const body = await request.formData();
	const file = body.get("file") as File;

	const buffer = Buffer.from((await file.arrayBuffer()) as ArrayBuffer);
	const fileExtension = file.name.split(".").pop();
	const presignedURL = await uploadFileToS3(buffer, file.name);

	let content: string;

	if (fileExtension === "pdf") {
		const data = await fetch(
			`https://r2.studyjom.nrmnqdds.com/${presignedURL}`,
		);
		const buffer = await data.blob();
		const loader = new PDFLoader(buffer, {
			parsedItemSeparator: "",
		});
		const rawText = await loader.load();
		const text = rawText[0]?.pageContent;
		content = text;
	} else {
		const worker = await createWorker("eng");
		const ret = await worker.recognize(
			`https://r2.studyjom.nrmnqdds.com/${presignedURL}`,
		);
		content = ret.data.text;
		await worker.terminate();
	}

	return NextResponse.json(
		{
			data: `https://r2.studyjom.nrmnqdds.com/${presignedURL}`,
			content: content,
		},
		{
			status: 201,
		},
	);
}
