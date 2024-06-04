import { type TypeOf, z } from "zod";

const envVariables = z.object({
	// DATABASE
	DATABASE_HOST: z.string(),
	DATABASE_PORT: z.string(),
	DATABASE_PASSWORD: z.string(),
	DATABASE_USER: z.string(),
	DATABASE_NAME: z.string(),

	// GEMINI
	GEMINI_API_KEY: z.string(),

	// NODE_ENV
	NODE_ENV: z.string(),

	// JWT
	NEXT_PUBLIC_JWT_SECRET: z.string(),

	// R2
	NEXT_PUBLIC_R2_URL: z.string(),
	NEXT_PUBLIC_R2_BUCKET_NAME: z.string(),
	NEXT_PUBLIC_R2_ACCESS_KEY_ID: z.string(),
	NEXT_PUBLIC_R2_SECRET_ACCESS_KEY: z.string(),

	// NEXT_TELEMETRY_DISABLED
	NEXT_TELEMETRY_DISABLED: z.coerce.number().int(),

	REDIS_URL: z.string(),
});

envVariables.parse(process.env);

declare global {
	namespace NodeJS {
		interface ProcessEnv extends TypeOf<typeof envVariables> {}
	}
}
