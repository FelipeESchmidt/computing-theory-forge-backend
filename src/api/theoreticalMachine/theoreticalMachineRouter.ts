import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { TheoreticalMachineSaveSchema } from '@/api/theoreticalMachine/theoreticalMachineModel';
import { theoreticalMachineService } from '@/api/theoreticalMachine/theoreticalMachineService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { authenticateToken } from '@/common/middleware/authMiddleware';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const theoreticalMachineRegistry = new OpenAPIRegistry();

export const theoreticalMachineRouter: Router = (() => {
  const router = express.Router();

  theoreticalMachineRegistry.registerPath({
    method: 'post',
    path: '/theoretical-machineService/save-machine',
    tags: ['TheoreticalMachineService'],
    request: { body: { content: { 'application/json': { schema: TheoreticalMachineSaveSchema } } } },
    responses: createApiResponse(z.string(), 'Success'),
  });

  router.post(
    '/save-machine',
    authenticateToken,
    validateRequest(TheoreticalMachineSaveSchema),
    async (req: Request, res: Response) => {
      const serviceResponse = await theoreticalMachineService.saveMachine(req.body, req.params.email as string);
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();
