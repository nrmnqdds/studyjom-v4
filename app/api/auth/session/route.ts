import { decipher } from "@/lib/cipher";
import { logger } from "@/lib/logger";
import { redisClient } from "@/lib/redis";
import * as jose from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	const token = cookies().get("studyjom-session");

	if (!token || !token.value) {
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

	const namespace = JSON.parse(
		atob(myDecipher(payload.sub)).split("").reverse().join(""),
	);

	logger.info(`namespace from cookie: ${namespace}`);

	if (!namespace) {
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

	const session = await redisClient.hgetall(namespace);

	if (!session || Object.keys(session).length === 0) {
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

	return NextResponse.json({ data: session }, { status: 200 });
}
