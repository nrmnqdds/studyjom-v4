import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="bg-red-300 w-full h-screen flex flex-col gap-5 tems-center justify-center">
			<Image
				src="/ServiceLogos/404 NotFound.png"
				alt="not found"
				width={100}
				height={100}
			/>
			<Link href="/">Return Home</Link>
		</div>
	);
}
