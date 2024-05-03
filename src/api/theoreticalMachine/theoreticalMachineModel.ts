import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type TheoreticalMachine = z.infer<typeof TheoreticalMachineSchema>;
export const TheoreticalMachineSchema = z.object({
  name: z.string(),
  machine: z.string(),
});

// Input Validation for 'POST /theoretical-machineService/save' endpoint
export const TheoreticalMachineSaveSchema = z.object({
  body: z.object({
    name: TheoreticalMachineSchema.shape.name,
    machine: TheoreticalMachineSchema.shape.machine,
  }),
});
