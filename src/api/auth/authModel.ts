import { commonValidations } from '@/common/utils/commonValidation';
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

export type Register = z.infer<typeof RegisterSchema>;
export const RegisterSchema = z.object({
  ...AuthSchema.shape,
  passwordConfirmation: z.string(),
});

// Input Validation for 'POST /auth/register' endpoint
export const PostRegisterSchema = z.object({
  body: z.object({
    email: AuthSchema.shape.email,
    password: commonValidations.password,
    passwordConfirmation: commonValidations.password,
  }),
});
