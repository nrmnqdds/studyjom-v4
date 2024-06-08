import { constant } from "@/constants";
import { db } from "@/drizzle";
import { users } from "@/drizzle/schema/user";
import { cipher, decipher } from "@/lib/cipher";
import { logger } from "@/lib/logger";
import { redisClient } from "@/lib/redis";
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import got from "got";
import * as jose from "jose";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { parse } from "node-html-parser";
import { CookieJar } from "tough-cookie";

const today = new Date().toISOString();

export async function POST(request: NextRequest) {
	const body = await request.json();

	const user = await db
		.select()
		.from(users)
		.where(eq(users.matric_no, body.username));

	if (user.length > 0) {
		logger.info("User is in database. Proceed to use existing data.");
		const isPasswordValid = await bcrypt.compare(
			body.password,
			user[0]?.password as string,
		);

		if (!isPasswordValid) {
			logger.error("User is in database. Invalid username or password");
			return NextResponse.json(
				{
					error: "Invalid username or password",
				},
				{
					status: 401,
				},
			);
		}

		const namespace = `session-${user[0].id}`;

		try {
			const setHash = await redisClient.hset(namespace, user[0]);
			logger.info(setHash);
		} catch (e) {
			logger.error("Error setting session in redis");
		}
		logger.info("Session set in redis");

		const myCipher = cipher(process.env.NEXT_PUBLIC_JWT_SECRET);
		const encryptedData = myCipher(
			btoa(JSON.stringify(namespace).split("").reverse().join("")),
		);

		const token = await new jose.SignJWT({
			username: body.username,
			today,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt(new Date())
			.setJti(createId())
			.setIssuer("studyjom")
			.setExpirationTime("31d")
			.setSubject(encryptedData)
			.sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));

		cookies().set({
			name: "studyjom-session",
			value: token,
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
			maxAge: 2678400,
		});

		return NextResponse.json(
			{
				data: user[0],
			},
			{
				status: 200,
			},
		);
	}

	logger.info("No user found, proceed to login");

	try {
		const cookieJar = new CookieJar();

		const payload = new URLSearchParams({
			username: body.username,
			password: body.password,
			execution: "e1s1",
			_eventId: "submit",
			geolocation: "",
		});
		await got(constant.IMALUUM_CAS_PAGE, {
			cookieJar,
			https: { rejectUnauthorized: false },
			followRedirect: false,
		});

		const { headers } = await got.post(constant.IMALUUM_LOGIN_PAGE, {
			cookieJar,
			https: { rejectUnauthorized: false },
			body: payload.toString(),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Referer: constant.IMALUUM_CAS_PAGE,
			},
			followRedirect: false,
		});

		await got(headers.location as string, {
			cookieJar,
			https: { rejectUnauthorized: false },
			followRedirect: false,
		});

		const cookieStore = cookieJar.toJSON().cookies;

		if (cookieStore.length === 0) {
			logger.error("No cookie retrieved");
			return NextResponse.json(
				{
					error: "Invalid username or password",
				},
				{
					status: 401,
				},
			);
		}

		const response = await got(constant.IMALUUM_HOME_PAGE, {
			cookieJar,
			https: { rejectUnauthorized: false },
			followRedirect: false,
		});

		if (!response.ok) {
			logger.error("Can't get into imaluum home page");
			return NextResponse.json(
				{
					error: "Internal Server Error",
				},
				{
					status: 500,
				},
			);
		}

		const root = parse(response.body);
		const hiddenTextSelector = root.querySelector(
			".navbar-custom-menu ul.nav.navbar-nav li.dropdown.user.user-menu span.hidden-xs",
		);

		const imageURL = `https://corsproxy.io/?https://smartcard.iium.edu.my/packages/card/printing/camera/uploads/original/${body.username}.jpeg`;
		const name =
			hiddenTextSelector?.textContent?.trim().replace(/\s+/g, " ") ?? "";

		const hashedPassword = await bcrypt.hash(body.password, 10);

		const user = await db
			.insert(users)
			.values({
				full_name: name,
				matric_no: body.username,
				password: hashedPassword,
				image_url: imageURL,
			})
			.returning({
				id: users.id,
				full_name: users.full_name,
				matric_no: users.matric_no,
				image_url: users.image_url,
				points: users.points,
			});
		logger.info("User created successfully");

		const namespace = `session-${user[0].id}`;
		try {
			const setHash = await redisClient.hset(namespace, user[0]);
			logger.info(setHash);
		} catch (e) {
			logger.error("Error setting session in redis");
		}
		logger.info("Session set in redis");

		const myCipher = cipher(process.env.NEXT_PUBLIC_JWT_SECRET);
		const encryptedData = myCipher(
			btoa(JSON.stringify(namespace).split("").reverse().join("")),
		);

		const token = await new jose.SignJWT({
			username: body.username,
			today,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt(new Date())
			.setJti(createId())
			.setIssuer("studyjom")
			.setExpirationTime("31d")
			.setSubject(encryptedData)
			.sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));

		cookies().set({
			name: "studyjom-session",
			value: token,
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
			maxAge: 2678400,
		});

		return NextResponse.json(
			{
				data: user[0].id,
			},
			{
				status: 200,
			},
		);
	} catch (error) {
		logger.error("Internal Server Error");
		return NextResponse.json(
			{
				error: "Internal Server Error",
			},
			{
				status: 500,
			},
		);
	}
}

export async function DELETE() {
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

	await redisClient.del(namespace);

	cookies().delete("studyjom-session");

	return NextResponse.json(
		{
			message: "Logged out successfully",
		},
		{
			status: 200,
		},
	);
}
