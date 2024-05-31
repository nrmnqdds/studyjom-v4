import { constant } from "@/constants";
import { db } from "@/drizzle";
import { users } from "@/drizzle/schema/user";
import { cipher } from "@/lib/cipher";
import { logger } from "@/lib/logger";
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

	const cookieJar = new CookieJar();

	const payload = new URLSearchParams({
		username: body.username,
		password: body.password,
		execution: "e1s1",
		_eventId: "submit",
		geolocation: "",
	});

	try {
		const user = await db
			.select()
			.from(users)
			.where(eq(users.matric_no, body.username));

		if (user) {
			const isPasswordValid = await bcrypt.compare(
				body.password,
				user[0]?.password as string,
			);

			if (!isPasswordValid) {
				return NextResponse.json(
					{
						error: "Invalid username or password",
					},
					{
						status: 401,
					},
				);
			}

			const myCipher = cipher(process.env.NEXT_PUBLIC_JWT_SECRET);
			const encryptedData = myCipher(
				btoa(JSON.stringify(user).split("").reverse().join("")),
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
	} catch (err) {
		return NextResponse.json(
			{
				error: "Invalid username or password",
			},
			{
				status: 401,
			},
		);
	}

	logger.info("No user found, proceed to login");

	try {
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

		if (!hiddenTextSelector) {
			// Check if the selectors were found
			return NextResponse.json(
				{
					error: "Internal Server Error",
				},
				{
					status: 500,
				},
			);
		}

		const imageURL = `https://corsproxy.io/?https://smartcard.iium.edu.my/packages/card/printing/camera/uploads/original/${body.username}.jpeg`;
		const name =
			hiddenTextSelector.textContent?.trim().replace(/\s+/g, " ") ?? "";

		const hashedPassword = await bcrypt.hash(body.password, 10);

		const user = await db
			.insert(users)
			.values({
				full_name: name,
				matric_no: body.username,
				password: hashedPassword,
				image_url: imageURL,
			})
			.returning();

		const myCipher = cipher(process.env.NEXT_PUBLIC_JWT_SECRET);
		const encryptedData = myCipher(
			btoa(JSON.stringify(user[0]).split("").reverse().join("")),
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
	} catch (error) {
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
