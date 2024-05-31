import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./drizzle/schema/*",
	dialect: "postgresql",
	out: "./drizzle/migrations",
	dbCredentials: {
		user: process.env.DATABASE_USER,
		host: process.env.DATABASE_HOST,
		database: process.env.DATABASE_NAME,
		password: process.env.DATABASE_PASSWORD,
		port: Number.parseInt(process.env.DATABASE_PORT),
	},
	verbose: true,
	strict: true,
});
