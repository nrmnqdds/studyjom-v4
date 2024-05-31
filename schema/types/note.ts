import { notes } from "@/drizzle/schema/user";
import type { createSelectSchema } from "drizzle-zod";

export type TNote = typeof createSelectSchema;
notes;
