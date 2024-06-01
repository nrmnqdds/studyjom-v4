"use client";

import { useQuery } from "@tanstack/react-query";
import { Document, Page, pdfjs } from "react-pdf";
import SuperLink from "./super-link";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.js",
	import.meta.url,
).toString();

type UnverifiedNotesProps = {
	id: string;
	title: string;
	desc: string;
	subject_name: string;
	file_url: string;
};

const UnverifiedNotes = () => {
	const { data, isFetching } = useQuery({
		queryKey: ["unverified-notes"],
		queryFn: async () => {
			const res = await fetch("/api/note?type=unverified");
			const json = await res.json();
			return json.data;
		},
	});

	return (
		<section className="w-full flex flex-row items-center gap-5">
			{isFetching ? (
				<>
					{Array.from({ length: 5 }).map((_, index) => (
						<div
							key={index}
							className="w-1/5 flex flex-col gap-0.5 bg-green-800 border-2 border-black shadow-default p-2"
						>
							<Skeleton className="h-10 w-10" />
							<Skeleton className="h-10 w-10" />
							<Skeleton className="h-10 w-10" />
						</div>
					))}
				</>
			) : (
				data.map((note: UnverifiedNotesProps) => (
					<SuperLink
						key={note.id}
						href={`/note/${note.id}`}
						className="w-1/5 h-60 flex flex-col group justify-between gap-0.5 bg-green-800 border-2 border-black shadow-default p-2"
					>
						<div className="w-full relative h-full overflow-hidden transform transition-transform group-hover:scale-105 cursor-pointer">
							{note.file_url.split(".").pop() === "pdf" ? (
								<Document file={note.file_url}>
									<Page pageNumber={1} />
								</Document>
							) : (
								<Image
									src={note.file_url}
									alt={note.title}
									fill
									className="object-cover"
								/>
							)}
						</div>
						<div>
							<p className="text-white text-2xl">{note.title}</p>
							<p className="text-green-200 text-sm">{note.desc}</p>
							<p className="text-white text-sm">{note.subject_name}</p>
						</div>
					</SuperLink>
				))
			)}
		</section>
	);
};

export default UnverifiedNotes;
