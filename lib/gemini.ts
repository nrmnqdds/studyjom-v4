import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from "@google/generative-ai";

const aiConfig = {
	// These Gemini models are updated upto September 2021
	gemini: {
		textOnlyModel: "gemini-pro",
		textAndImageModel: "gemini-pro-vision",
		apiKey: process.env.GEMINI_API_KEY,

		// Gemini Safety Settings
		// Explore all Harm categories here -> https://ai.google.dev/api/rest/v1beta/HarmCategory
		// Explore all threshold categories -> https://ai.google.dev/docs/safety_setting_gemini
		safetySettings: [
			{
				category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
			},
			{
				category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
			},
			{
				category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
			},
			{
				category: HarmCategory.HARM_CATEGORY_HARASSMENT,
				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
			},
		],
	},
};

export const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);

const QA_TEMPLATE = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Please return an answer in markdown with clear headings and lists if needed to:`;

export const generatePrompt = async (prompt: string) => {
	const model = genAI.getGenerativeModel({
		model: aiConfig.gemini.textOnlyModel,
		safetySettings: aiConfig.gemini.safetySettings,
	});

	// prompt is a single string
	try {
		const result = await model.generateContent(prompt);
		const chatResponse = result?.response?.text();

		return { result: chatResponse };
	} catch (error) {
		console.error("generatePrompt | error", error);
		return { Error: "Uh oh! Caught error while fetching AI response" };
	}
};
