import { Request } from 'express';
import { CustomerApi } from './users.interface';

export interface RequestApiKey extends Request {
  customer_key: CustomerApi;
}
