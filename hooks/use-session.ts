import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
	const data = useQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const res = await fetch("/api/auth/session");
			if (!res.ok) {
				return null;
			}
			const json = await res.json();
			return json.data;
		},
	});

	return { ...data, session: data.data };
};
