"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithRef } from "react";

const SuperLink = (props: ComponentPropsWithRef<typeof Link>) => {
	const router = useRouter();
	return (
		<Link
			{...props}
			onMouseEnter={(e) => {
				const href =
					typeof props.href === "string" ? props.href : props.href.href;
				if (href) {
					router.prefetch(href);
				}
				return props.onMouseEnter?.(e);
			}}
		/>
	);
};

export default SuperLink;
