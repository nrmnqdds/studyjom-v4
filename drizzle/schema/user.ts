import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	integer,
	pgTable,
	text,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey().$defaultFn(createId),
	full_name: text("full_name").notNull(),
	matric_no: varchar("matric_no", { length: 50 }).notNull(),
	password: text("password").notNull(),
	image_url: text("image_url").notNull(),
	points: integer("points").$defaultFn(() => 0),
	credits: integer("credits").$defaultFn(() => 0),
	created_at: date("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const userNotes = relations(users, ({ many }) => ({
	notes: many(notes),
}));

export const notes = pgTable("notes", {
	id: text("id").primaryKey().$defaultFn(createId),
	title: text("title").notNull(),
	desc: text("desc").notNull(),
	author_id: text("author_id").notNull(),
	subject_name: text("subject_name").notNull(),
	is_verified: boolean("is_verified").default(false),
	file_url: text("file_url").notNull(),
	file_content: text("file_content").notNull(),
	created_at: date("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const noteAuthor = relations(notes, ({ one, many }) => ({
	author: one(users, {
		fields: [notes.author_id],
		references: [users.id],
	}),
	comments: many(comments),
}));

export const comments = pgTable("comments", {
	id: text("id").primaryKey().$defaultFn(createId),
	note_id: text("note_id").notNull(),
	author_id: text("author_id").notNull(),
	content: text("content").notNull(),
	created_at: date("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const upVotes = pgTable("up_votes", {
	id: text("id").primaryKey().$defaultFn(createId),
	note_id: text("note_id").notNull(),
	user_id: text("user_id").notNull(),
	created_at: date("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const downVotes = pgTable("down_votes", {
	id: text("id").primaryKey().$defaultFn(createId),
	note_id: text("note_id").notNull(),
	user_id: text("user_id").notNull(),
	created_at: date("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const userVotes = relations(users, ({ many }) => ({
	upVotes: many(upVotes),
	downVotes: many(downVotes),
}));

export const commentAuthor = relations(comments, ({ one }) => ({
	note: one(notes, {
		fields: [comments.note_id],
		references: [notes.id],
	}),
}));
