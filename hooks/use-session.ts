import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useSession = () => {
  const [currentSession, setCurrentSession] = useState();
  const data = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        return null;
      }
      const json = await res.json();
      setCurrentSession(json.data);
      return json.data;
    },
    enabled: !currentSession,
  });

  return { ...data, session: currentSession || data.data };
};
