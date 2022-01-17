import config from 'config';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import { compareSync } from 'bcryptjs';
import { RequestApiKey } from '@/interfaces/apikey.interface';
import { CustomerApiKey } from '@/entities/app.entity';

const ApiKeyMiddleware = async (req: RequestApiKey, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.headers['X-API-Key'] || req.headers['x-api-key'];
    if (Authorization) {
      const findCustomer = await CustomerApiKey.findOne({ where: { apiKey: Authorization } });
      if (findCustomer) {
        req.customer_key = findCustomer;
        next();
      } else {
        next(new HttpException(401, 'wrong x-api-key'));
      }
    } else {
      next(new HttpException(404, 'api-key not found'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong key'));
  }
};

export default ApiKeyMiddleware;
