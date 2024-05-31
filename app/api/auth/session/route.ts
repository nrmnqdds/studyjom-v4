import { db } from "@/drizzle";
import { users } from "@/drizzle/schema/user";
import { decipher } from "@/lib/cipher";
import { logger } from "@/lib/logger";
import type { TUser } from "@/schema/types/user";
import { eq } from "drizzle-orm";
import * as jose from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	const token = cookies().get("studyjom-session");

	if (!token) {
		return NextResponse.json(
			{
				error: "Unauthorized",
			},
			{
				status: 401,
			},
		);
	}

	const { payload } = await jose.jwtVerify(
		token.value,
		new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET),
		{
			issuer: "studyjom",
			algorithms: ["HS256"],
		},
	);

	if (!payload) {
		cookies().delete("studyjom-session");
		return NextResponse.json(
			{
				error: "Unauthorized",
			},
			{
				status: 401,
			},
		);
	}

	const myDecipher = decipher(process.env.NEXT_PUBLIC_JWT_SECRET as string);

	const session: TUser = JSON.parse(
		atob(myDecipher(payload.sub)).split("").reverse().join(""),
	);

	logger.info("session from cookie: ", session);

	if (!session) {
		cookies().delete("studyjom-session");
		return NextResponse.json(
			{
				error: "Unauthorized",
			},
			{
				status: 401,
			},
		);
	}

	const user = await db.select().from(users).where(eq(users.id, session.id));

	if (user.length === 0) {
		cookies().delete("studyjom-session");
		return NextResponse.json(
			{
				error: "Unauthorized",
			},
			{
				status: 401,
			},
		);
	}

	return NextResponse.json({ data: user[0] }, { status: 200 });
}
