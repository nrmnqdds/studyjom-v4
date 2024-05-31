"use client";

import { useQuery } from "@tanstack/react-query";
import SuperLink from "./super-link";

type UnverifiedNotesProps = {
	id: string;
	title: string;
	desc: string;
	subject_name: string;
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
							<div className="animate-pulse bg-green-800 h-10 w-full" />
							<div className="animate-pulse bg-green-800 h-4 w-3/4" />
							<div className="animate-pulse bg-green-800 h-4 w-1/2" />
						</div>
					))}
				</>
			) : (
				data.map((note: UnverifiedNotesProps) => (
					<SuperLink
						key={note.id}
						href={`/note/${note.id}`}
						className="w-1/5 flex flex-col gap-0.5 bg-green-800 border-2 border-black shadow-default p-2"
					>
						<p className="text-white text-2xl">{note.title}</p>
						<p className="text-green-200 text-sm">{note.desc}</p>
						<p className="text-white text-sm">{note.subject_name}</p>
					</SuperLink>
				))
			)}
		</section>
	);
};

export default UnverifiedNotes;
