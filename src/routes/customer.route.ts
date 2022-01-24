import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import CustomerController from '@/controllers/customer.controller';
import ApiKeyMiddleware from '@/middlewares/apiValidation.middleware';
import { OrderDto } from '@/dtos/order.dts';
import { QouteDto } from '@/dtos/qoute.dtos';
import { CancelOrderDto } from '@/dtos/cancelOrder.dto';

class CustomerRoute implements Routes {
  public path = '/api/customer/';
  public router = Router();
  public customerController = new CustomerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}createApikey`, authMiddleware, this.customerController.generateApiKey);
    this.router.get(`${this.path}getApikey`, authMiddleware, this.customerController.getCustomerKey);
    this.router.post(`${this.path}quote`, [ApiKeyMiddleware, validationMiddleware(QouteDto, 'body')], this.customerController.getCustomerQuote);
    this.router.post(`${this.path}order`, [ApiKeyMiddleware, validationMiddleware(OrderDto, 'body')], this.customerController.CustomerOrder);
  }
}

export default CustomerRoute;
