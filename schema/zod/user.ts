import { z } from "zod";

export const UserSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required!" }),
  matricNo: z.string().min(1, { message: "Matric number is required!" }),
  password: z.string().min(1, { message: "Password is required!" }),
  imageURL: z.string().min(1, { message: "Image URL is required!" }),
  posts: z.array(z.string()).default([]),
  points: z.number().default(0),
});
