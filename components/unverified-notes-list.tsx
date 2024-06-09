"use client";

import { Document, Page, pdfjs } from "react-pdf";
import SuperLink from "./super-link";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useSession } from "@/hooks/use-session";
import { useUnverifiedNotes } from "@/hooks/use-unverified-notes";
import Image from "next/image";
import toast from "react-hot-toast";
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
  const { data, isFetching } = useUnverifiedNotes();
  const { session } = useSession();

  return (
    <section className="w-full flex flex-row items-center gap-5">
      {isFetching ? (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-1/5 h-60" />
          ))}
        </>
      ) : (
        data.map((note: UnverifiedNotesProps) => (
          <SuperLink
            key={note.id}
            href={`/note/${note.id}`}
            className="w-1/5 h-60 flex flex-col group justify-between gap-0.5 bg-green-800 border-2 border-black shadow-default p-2"
            onClick={() => {
              if (!session) {
                toast.error("You need to login to view this note");
              }
            }}
          >
            <div className="w-full relative h-full overflow-hidden cursor-pointer">
              {note.file_url.split(".").pop() === "pdf" ? (
                <Document file={note.file_url}>
                  <Page
                    pageNumber={1}
                    className="group-hover:scale-105 transform transition-transform"
                  />
                </Document>
              ) : (
                <Image
                  src={note.file_url}
                  alt={note.title}
                  fill
                  className="object-cover group-hover:scale-105 transform transition-transform"
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
