import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

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
  name: z.string(),
  passwordConfirmation: z.string(),
});

// Input Validation for 'POST /auth/register' endpoint
export const PostRegisterSchema = z.object({
  body: z.object({
    name: RegisterSchema.shape.name,
    email: AuthSchema.shape.email,
    password: commonValidations.password,
    passwordConfirmation: commonValidations.password,
  }),
});

export type Update = z.infer<typeof UpdateSchema>;
export const UpdateSchema = z.object({
  name: RegisterSchema.shape.name,
  password: AuthSchema.shape.password,
  newPassword: z.string(),
  newPasswordConfirmation: z.string(),
});

// Input Validation for 'POST /auth/Update' endpoint
export const PostUpdateSchema = z.object({
  body: z.object({
    name: UpdateSchema.shape.name,
    password: AuthSchema.shape.password,
    newPassword: commonValidations.password,
    newPasswordConfirmation: commonValidations.password,
  }),
});
