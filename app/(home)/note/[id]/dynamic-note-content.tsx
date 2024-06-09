"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Tmq5OTvMQn9
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/default/avatar";
import { Button } from "@/components/default/button";
import { Textarea } from "@/components/default/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { constant } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { Download, MessageSquareWarning } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Image from "next/image";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const DynamicNoteContent = ({ id }: { id: string }) => {
  const { data: note, isFetching } = useQuery({
    queryKey: ["note"],
    queryFn: async () => {
      const res = await fetch(`/api/note/${id}`);
      const json = await res.json();
      return json.data;
    },
  });

  return isFetching ? (
    <div>Loading...</div>
  ) : (
    <div className="w-full h-full relative flex flex-col">
      <header className="bg-green-900 flex flex-row items-center justify-between text-white py-4 px-6 rounded-2xl">
        <h1 className="text-2xl font-bold">{note.title}</h1>
        <div className="flex flex-row gap-2">
          <Button
            className="w-full flex flex-row items-center justify-center gap-2 bg-blue-300"
            onClick={async () => {
              const res = await fetch(note.file_url);
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = note.file_url;
              a.click();
            }}
          >
            <Download />
            <span>Download</span>
          </Button>
          <Button
            className="w-full flex flex-row items-center justify-center gap-2 bg-red-300"
          // onClick={async () => {
          //   const res = await fetch(note.file_url);
          //   const blob = await res.blob();
          //   const url = URL.createObjectURL(blob);
          //   const a = document.createElement("a");
          //   a.href = url;
          //   a.download = note.file_url;
          //   a.click();
          // }}
          >
            <MessageSquareWarning />
            <span>Report</span>
          </Button>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-3 gap-6 p-6">
        <div className="col-span-2 relative bg-gray-100 rounded-lg overflow-hidden">
          <div className="w-full absolute h-full ">
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
        </div>
        <div className="flex flex-col gap-4">
          <ScrollArea className="bg-purple-200 rounded-lg p-4 flex-1">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <img src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">John Doe</div>
                  <div className="text-gray-500">This is a great document!</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Avatar>
                  <img src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>JA</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Jane Arden</div>
                  <div className="text-gray-500">
                    I agree, it's very informative.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Avatar>
                  <img src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">Sarah Miller</div>
                  <div className="text-gray-500">
                    Can't wait to read this later.
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
      {/* <div className="bg-gray-100 p-4 border-t">
				<div className="relative">
					<Textarea
						placeholder="Add a comment..."
						className="pr-16 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-0"
					/>
					<Button type="submit" size="icon" className="absolute top-3 right-3">
						<ArrowUpIcon className="h-4 w-4" />
						<span className="sr-only">Send</span>
					</Button>
				</div>
			</div> */}
    </div>
  );
};

export default DynamicNoteContent;
