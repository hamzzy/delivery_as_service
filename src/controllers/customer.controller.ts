import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import CustomerService from '@/services/customer.service';
import { RequestApiKey } from '@/interfaces/apikey.interface';

class CustomerController {
  public customerService = new CustomerService();
  public generateApiKey = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.user;
      const api_data = await this.customerService.CustomerKey(id);
      res.status(201).send(api_data);
    } catch (error) {
      next(error);
    }
  };

  public cust = async (req: RequestApiKey, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.customer_key;
      res.status(201).json(id);
    } catch (error) {
      next(error);
    }
  };
}

export default CustomerController;
