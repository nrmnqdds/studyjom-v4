import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/contexts/query-provider";
import SessionProvider from "@/contexts/session-provider";
import { Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

const bricolageGrotesk = Bricolage_Grotesque({
	subsets: ["latin"],
	weight: "700",
	display: "swap",
	adjustFontFallback: false,
});

export const metadata: Metadata = {
	title: "StudyJom",
	description: "Need to study? StudyJom is here to help!",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
	keywords: [
		"StudyJom",
		"studyjom",
		"iium note sharing app",
		"iium notes",
		"iium notes sharing",
		"iium notes sharing platform",
	],
	metadataBase: new URL("https://studyjom.nrmnqdds.com/"),
	openGraph: {
		type: "website",
		url: "https://studyjom.nrmnqdds.com",
		title: "StudyJom",
		description: "Need to study? StudyJom is here to help!",
		siteName: "StudyJom",
		images: [
			{
				url: "https://opengraph.b-cdn.net/production/documents/48b8d2e9-05b8-4031-a6df-d9f67c593a12.png?token=FYcQmGL_FJVfTNVPl0p3ZLE_BIL6mV2ov1UcB79F1yg&height=591&width=1200&expires=33242072632",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@nrmnqdds",
		creator: "@nrmnqdds",
		title: "StudyJom",
		description: "Need to study? StudyJom is here to help!",
		images:
			"https://opengraph.b-cdn.net/production/documents/48b8d2e9-05b8-4031-a6df-d9f67c593a12.png?token=FYcQmGL_FJVfTNVPl0p3ZLE_BIL6mV2ov1UcB79F1yg&height=591&width=1200&expires=33242072632",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`max-w-screen scrollbar-thin scrollbar-track-pink-200 scrollbar-thumb-pink-400 overflow-x-hidden ${bricolageGrotesk.className}`}
		>
			<body>
				<QueryProvider>
					<SessionProvider>
						{children}
						<Toaster />
					</SessionProvider>
				</QueryProvider>
				<Script
					defer
					src="https://umami.studyjom.nrmnqdds.com/script.js"
					data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
				/>
			</body>
		</html>
	);
}
