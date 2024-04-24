import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { PostLoginSchema } from '@/api/auth/authModel';
import { authService } from '@/api/auth/authService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = express.Router();

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/login',
    tags: ['Auth'],
    request: { body: { content: { 'application/json': { schema: PostLoginSchema } } } },
    responses: createApiResponse(z.string(), 'Success'),
  });

  router.post('/login', validateRequest(PostLoginSchema), async (req: Request, res: Response) => {
    const serviceResponse = await authService.login(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
