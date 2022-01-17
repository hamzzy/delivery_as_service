import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import CustomerService from '@/services/customer.service';
import { RequestApiKey } from '@/interfaces/apikey.interface';
import { QouteRequest, QouteResponse } from '@/interfaces/quote.interface';
import { HttpException } from '@/exceptions/HttpException';

class CustomerController {
  public customerService = new CustomerService();
  public generateApiKey = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.user;
      const api_data = await this.customerService.CustomerKey(id);
      res.status(201).json({ apiKey: api_data.apiKey });
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        next(new HttpException(400, 'key Created already'));
      } else {
        next(error);
      }
    }
  };

  public getCustomerKey = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.user;
      const api_data = await this.customerService.getCustomerKey(id);
      res.status(200).json({ api_key: api_data.apiKey });
    } catch (error) {
      next(error);
    }
  };

  public getCustomerQuote = async (req: RequestApiKey, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { customer } = req.customer_key;
      const Data: QouteRequest = req.body;
      const api_data: QouteResponse = await this.customerService.GetCustomerQuote(Data, customer);
      res.status(201).json({ qoute_id: api_data.id, estimated_fee: api_data.estimated_price });
    } catch (error) {
      next(error);
    }
  };

  public CustomerOrder = async (req: RequestApiKey, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { customer } = req.customer_key;
      const Data = req.body;
      const api_data = await this.customerService.CustomerOrder(customer, Data);

      res.status(201).send(api_data);
    } catch (error) {
      next(error);
    }
  };

  public CustomerOrderCancel = async (req: RequestApiKey, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { customer } = req.customer_key;
      const order_id: any = req.body;
      const api_data = await this.customerService.CustomerCancelOrder(customer, order_id);
      res.status(201).json(api_data);
    } catch (error) {
      next(error);
    }
  };
}

export default CustomerController;
