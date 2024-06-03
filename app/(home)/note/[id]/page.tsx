import { constant } from "@/constants";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import DynamicNoteContent from "./dynamic-note-content";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const res = await fetch(`${constant.BACKEND_URL}/note/${id}`);
  const data = await res.json();

  return {
    title: `StudyJom | ${data.data.title}`,
  };
}

const DynamicNotePage = async ({ params }: Props) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(`${constant.BACKEND_URL}/notes/${params.id}`);
      const json = await res.json();
      return json.data;
    },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DynamicNoteContent id={params.id} />
      </HydrationBoundary>
    </Suspense>
  );
};

export default DynamicNotePage;
