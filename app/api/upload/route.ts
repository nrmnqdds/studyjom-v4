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

// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
	const newFileName = await uploadFileToS3(buffer, file.name);
	const fileExtension = file.name.split(".").pop();

	const presignedURL = `https://r2.studyjom.nrmnqdds.com/${newFileName}`;

	if (fileExtension === "pdf") {
		const data = await fetch(presignedURL);
		const buffer = await data.blob();
		const loader = new PDFLoader(buffer, {
			parsedItemSeparator: "",
			splitPages: false,
		});
		const rawText = await loader.load();
		const text = rawText[0]?.pageContent;

		const prompt =
			"Create a summary of this whole context, so that another chat instace could understand the summary and context, with compression. Make sure to do not leave whitespaces.";

		const result = await model.generateContent([prompt, text]);
		const chatResponse = JSON.stringify(
			result?.response
				?.text()
				.trim()
				.split(/\s{2,}/),
		)
			.replace(/((^")|("$))/g, "")
			.trim();

		logger.info(`Chat response: ${chatResponse}`);

		return NextResponse.json(
			{
				data: presignedURL,
				content: chatResponse || "",
			},
			{
				status: 201,
			},
		);
	}

	const prompt =
		"Extract all text from the image and convert it into a plain text format. Create a summary of this whole context, so that another chat instace could understand the summary and context, with compression. Make sure to do not leave whitespaces.";

	const imagePart = await fileToGenerativePart(presignedURL, "image/*");

	const result = await model.generateContent([prompt, imagePart]);
	const chatResponse = JSON.stringify(
		result?.response
			?.text()
			.trim()
			.split(/\s{2,}/),
	)
		.replace(/((^")|("$))/g, "")
		.trim();

	logger.info(`Chat response: ${chatResponse}`);

	return NextResponse.json(
		{
			data: presignedURL,
			content: chatResponse || "",
		},
		{
			status: 201,
		},
	);
}
