import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres({
	user: process.env.DATABASE_USER,
	host: process.env.DATABASE_HOST,
	database: process.env.DATABASE_NAME,
	password: process.env.DATABASE_PASSWORD,
	port: Number.parseInt(process.env.DATABASE_PORT),
	connect_timeout: 10,
});

export const db = drizzle(client);
