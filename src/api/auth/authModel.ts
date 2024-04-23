import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Auth = z.infer<typeof AuthSchema>;
export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Input Validation for 'POST /auth/login' endpoint
export const PostLoginSchema = z.object({
  body: z.object({
    email: AuthSchema.shape.email,
    password: AuthSchema.shape.password,
  }),
});
