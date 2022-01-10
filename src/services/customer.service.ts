import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { Customer } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { CustomerApiKey } from '@/entities/app.entity';
import { generatedApiKey } from '@/utils/util';

@EntityRepository()
class CustomerService extends Repository<CustomerApiKey> {
  public async CustomerKey(customer_id: any): Promise<any> {
    const ApiKey = await generatedApiKey();
    const cus = new CustomerApiKey();
    cus.apiKey = ApiKey;
    cus.customer = customer_id;
    const createApiKey = await CustomerApiKey.findOne({ where: { customer: customer_id } });
    return true;
  }
}

export default CustomerService;
