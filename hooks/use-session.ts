import type { TUser } from "@/schema/types/user";
import { create } from "zustand";

type SessionStore = {
	session: TUser | undefined;
	setSession: (session: TUser | undefined) => void;
};

export const useSession = create<SessionStore>((set) => ({
	session: undefined,
	setSession: (session) => set({ session }),
}));
