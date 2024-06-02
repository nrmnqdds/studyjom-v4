// export const notes = pgTable("notes", {
// 	id: text("id").primaryKey().$defaultFn(createId),
// 	title: text("title").notNull(),
// 	desc: text("desc").notNull(),
// 	author_id: text("author_id").notNull(),
// 	subject_name: text("subject_name").notNull(),
// 	is_verified: boolean("is_verified").default(false),
// 	file_url: text("file_url").notNull(),
// 	file_content: text("file_content").notNull(),
// 	created_at: date("created_at")
// 		.notNull()
// 		.$defaultFn(() => new Date().toISOString()),
// });

export type TNote = {
	id: string;
	title: string;
	desc: string;
	author_id: string;
	subject_name: string;
	is_verified: boolean;
	file_url: string;
	file_content: string;
	created_at: string;
};
