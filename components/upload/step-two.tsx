"use client";

import { Button } from "@/components/default/button";
import { Input } from "@/components/default/input";
import SubjectsCombobox from "@/components/default/subjects-combobox";
import { useSession } from "@/hooks/use-session";
import { formatBytes } from "@/lib/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import * as z from "zod";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.js",
	import.meta.url,
).toString();

const UploadNoteSchema = z.object({
	title: z.string(),
	desc: z.string(),
	subjectName: z.string(),
	fileURL: z.string().optional(),
	fileContent: z.string().optional(),
	authorId: z.string(),
});

const StepTwo = ({ files }: { files: File[] }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const { session, refetch } = useSession();

	const form = useForm({
		resolver: zodResolver(UploadNoteSchema),
		defaultValues: {
			title: "",
			desc: "",
			subjectName: "",
			fileURL: "",
			fileContent: "",
		},
	});

	const createNoteMutation = useMutation({
		mutationKey: ["create-note"],
		mutationFn: async (data: z.infer<typeof UploadNoteSchema>) => {
			const res = await fetch("/api/note", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const json = await res.json();
			return json.data;
		},
		onSuccess: () => {
			setIsLoading(false);
			toast.dismiss();
			toast.success("Post created successfully");
			refetch();
			router.push("/browse");
		},
		onError: (error) => {
			setIsLoading(false);
			toast.dismiss();
			console.log(error.message);
			toast.error("Error creating post");
		},
	});

	// const uploadMutation = api.r2.upload.useMutation({
	const uploadMutation = useMutation({
		mutationKey: ["upload-to-r2"],
		mutationFn: async () => {
			const formData = new FormData();

			formData.append("file", files[0] as File);

			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const json = await res.json();
			return json;
		},
		onSuccess: async (data) => {
			if (!data.content) {
				toast.dismiss();
				setIsLoading(false);
				return toast.error("Error extracting text from file");
			}

			return await createNoteMutation.mutateAsync({
				...form.getValues(),
				fileURL: data.data,
				fileContent: data.content,
				authorId: session?.id as string,
			});
		},
		onError: (error) => {
			setIsLoading(false);
			toast.dismiss();
			console.log(error);
			toast.error("Error uploading files");
		},
	});

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		toast.loading("Uploading file...");
		await uploadMutation.mutateAsync();
	};

	return (
		<div className="w-full h-full flex flex-col items-center relative py-10 sm:py-24">
			<Button
				className="w-fit bg-red-300 hover:bg-red-400 active:bg-red-500 absolute bottom-10 left-10"
				onClick={() => router.back()}
			>
				Go back
			</Button>
			<h1 className="text-3xl font-bold text-black">Review your files</h1>
			<div className="w-full flex p-10 border-b border-indigo-200">
				<div className="flex items-center gap-2 bg-purple-300 p-2 rounded-lg shadow-default-md border-2 border-solid border-black w-1/2 h-fit">
					<div className="w-full overflow-hidden">
						<div
							className="w-full relative h-52 mb-5 overflow-hidden transform transition-transform hover:scale-105 cursor-pointer"
							onClick={() =>
								window.open(URL.createObjectURL(files[0] as File), "_blank")
							}
						>
							{files[0]?.type === "application/pdf" ? (
								<Document file={URL.createObjectURL(files[0] as File)}>
									<Page pageNumber={1} />
								</Document>
							) : (
								<Image
									src={URL.createObjectURL(files[0] as File)}
									alt={files[0]?.name as string}
									fill
									className="object-cover"
								/>
							)}
						</div>
						<p className="text-sm text-purple-800">
							{files[0]?.name as string}
						</p>
						<p className="text-sm text-purple-800">
							{formatBytes(files[0]?.size as number)}
						</p>
					</div>
				</div>
				<div className="flex-1 flex items-center justify-center">
					<form onSubmit={onSubmit} className="space-y-5 w-1/2">
						<div>
							<label htmlFor="title" className="text-black">
								Title
							</label>
							<Input
								type="text"
								id="title"
								className="w-full text-black"
								placeholder="Title for the post"
								{...form.register("title")}
							/>
							{/* <p className="text-red-400 text-sm">
                  {errors?.notes?.[index]?.title?.message ?? (
                    <span>&nbsp;</span>
                  )}
                </p> */}
						</div>
						<div>
							<label htmlFor="desc" className="text-black">
								Description
							</label>
							<Input
								type="text"
								id="desc"
								className="w-full text-black"
								placeholder="Description for the post"
								{...form.register("desc")}
							/>
							{/* <p className="text-red-400 text-sm">
                  {errors?.notes?.[index]?.desc?.message ?? <span>&nbsp;</span>}
                </p> */}
						</div>
						<div>
							<SubjectsCombobox
								title="Select Subject"
								onChange={(value) => form.setValue("subjectName", value)}
							/>
							<p className="text-red-400 text-sm">
								{/* {errors?.notes?.[index]?.subjectName?.message ?? (
                    <span>&nbsp;</span>
                  )} */}
							</p>
						</div>

						<Button
							type="submit"
							className="w-full bg-green-300 hover:bg-green-400 active:bg-lime-500 disabled:bg-lime-600"
							disabled={isLoading}
						>
							{isLoading ? "Uploading..." : "Upload!"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default StepTwo;
