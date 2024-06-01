import { genAI } from "@/lib/gemini";
import { logger } from "@/lib/logger";
import { r2Client } from "@/lib/r2";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { createId } from "@paralleldrive/cuid2";
import { type NextRequest, NextResponse } from "next/server";

// Converts local file information to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(url: string, mimeType: string) {
	const response = await fetch(url);
	const buffer = Buffer.from((await response.arrayBuffer()) as ArrayBuffer);
	return {
		inlineData: {
			data: buffer.toString("base64"),
			mimeType,
		},
	};
}

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

	if (fileExtension === "pdf") {
		const data = await fetch(
			`https://r2.studyjom.nrmnqdds.com/${presignedURL}`,
		);
		const buffer = await data.blob();
		const loader = new PDFLoader(buffer, {
			parsedItemSeparator: "",
			splitPages: false,
		});
		const rawText = await loader.load();
		const text = rawText[0]?.pageContent;
		return NextResponse.json(
			{
				data: `https://r2.studyjom.nrmnqdds.com/${presignedURL}`,
				content: text.trim() || "",
			},
			{
				status: 201,
			},
		);
	}
	// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

	const prompt =
		"Extract all text from the image and convert it into a plain text format. Make sure to do not leave whitespaces.";

	const imagePart = await fileToGenerativePart(
		`https://r2.studyjom.nrmnqdds.com/${presignedURL}`,
		"image/*",
	);

	const result = await model.generateContent([prompt, imagePart]);
	const chatResponse = result?.response?.text();
	logger.info(`chatResponse: ${chatResponse}`);

	return NextResponse.json(
		{
			data: `https://r2.studyjom.nrmnqdds.com/${presignedURL}`,
			content: chatResponse.trim() || "",
		},
		{
			status: 201,
		},
	);
}
