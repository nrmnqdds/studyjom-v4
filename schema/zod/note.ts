import { z } from "zod";

//working
export const NoteSchema = z.object({
  notes: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Title is required!" }),
        desc: z.string().min(1, { message: "Description is required!" }),
        authorId: z.string().min(1, { message: "Author ID is required!" }),
        subjectName: z
          .string()
          .min(1, { message: "Subject name is required!" }),
        upVotes: z.array(z.string()).optional().default([]),
        downVotes: z.array(z.string()).optional().default([]),
        isVerified: z.boolean().optional().default(false),
        fileURL: z.string().min(1, { message: "File URL is required!" }),
      })
    )
    .transform((rel) => {
      return Array.isArray(rel) ? rel : [rel];
    }),
});

// not working
// export const NoteSchema = z.array(z.object({
//   title: z.string().min(1, { message: "Title is required!" }),
//   desc: z.string().min(1, { message: "Description is required!" }),
//   authorId: z.string().min(1, { message: "Author ID is required!" }),
//   subjectName: z.string().min(1, { message: "Subject name is required!" }),
//   upVotes: z.array(z.string()).optional().default([]),
//   downVotes: z.array(z.string()).optional().default([]),
//   isVerified: z.boolean().optional().default(false),
//   fileURL: z.string().min(1, { message: "File URL is required!" }),
// }))
//   .transform((rel) => {
//     return Array.isArray(rel)
//       ? rel
//       : [rel];
//   })
