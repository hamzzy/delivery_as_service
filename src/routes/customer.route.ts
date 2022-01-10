import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import CustomerController from '@/controllers/customer.controller';
import ApiKeyMiddleware from '@/middlewares/apiValidation.middleware';

class CustomerRoute implements Routes {
  public path = '/api/customer/';
  public router = Router();
  public customerController = new CustomerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}getApikey`, authMiddleware, this.customerController.generateApiKey);
    this.router.get(`${this.path}key`, ApiKeyMiddleware, this.customerController.cust);

  }
}

export default CustomerRoute;
