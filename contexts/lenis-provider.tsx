"use client";

import ScrollProgress from "@/components/scroll-progress";
import { ReactLenis } from "lenis/react";

export default function LenisSmoothScroll({
	children,
}: { children: React.ReactNode }) {
	return (
		<ReactLenis root options={{ duration: 2.0 }}>
			<ScrollProgress />
			{children}
		</ReactLenis>
	);
}
