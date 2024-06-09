import { useQuery } from "@tanstack/react-query";

export const useUnverifiedNotes = () => {
  const query = useQuery({
    queryKey: ["unverified-notes"],
    queryFn: async () => {
      const res = await fetch("/api/note?type=unverified");
      const json = await res.json();
      return json.data;
    },
  });

  return { ...query };
};
