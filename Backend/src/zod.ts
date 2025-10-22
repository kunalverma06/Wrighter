import { z } from "zod";
import { ContentType } from "@prisma/client";


const SignupSchema = z.object({
  email: z.email(),
  username: z.string(),
  password: z.string().min(6).max(20),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});


const CreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  type: z.nativeEnum(ContentType), // ✅ links directly to Prisma enum
});

export { SignupSchema, LoginSchema, CreateSchema };
