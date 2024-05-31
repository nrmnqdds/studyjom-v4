import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/contexts/query-provider";
import SessionProvider from "@/contexts/session-provider";
import { Bricolage_Grotesque } from "next/font/google";
import { Toaster } from "react-hot-toast";

const bricolageGrotesk = Bricolage_Grotesque({
	subsets: ["latin"],
	weight: "700",
	display: "swap",
	adjustFontFallback: false,
});

export const metadata: Metadata = {
	title: "StudyJom V3",
	description: "Need to study? StudyJom is here to help!",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
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
			</body>
		</html>
	);
}
