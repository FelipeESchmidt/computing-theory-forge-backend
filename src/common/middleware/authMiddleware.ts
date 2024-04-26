import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { verifyToken } from '@/common/token/verify';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token == null) {
    const errorMessage = `Authentication token not provided`;
    const statusCode = StatusCodes.UNAUTHORIZED;
    return res
      .status(statusCode)
      .send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
  }

  verifyToken(
    token,
    () => {
      const errorMessage = `Authentication token is invalid`;
      const statusCode = StatusCodes.FORBIDDEN;
      return res
        .status(statusCode)
        .send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
    },
    (user) => {
      req.params = { ...req.params, email: user.email };
      next();
    }
  );
};
