import { z } from 'zod';

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !isNaN(Number(data)), 'ID must be a numeric value')
    .transform(Number)
    .refine((num) => num > 0, 'ID must be a positive number'),
  password: z
    .string()
    .min(8)
    .refine((data) => /[A-Z]/.test(data), 'Password must contain at least one uppercase letter')
    .refine((data) => /[a-z]/.test(data), 'Password must contain at least one lowercase letter')
    .refine((data) => /[0-9]/.test(data), 'Password must contain at least one number')
    .refine((data) => /[!@#$%^&*]/.test(data), 'Password must contain at least one special character'),
};
