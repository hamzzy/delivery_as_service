import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { Customer } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { CustomerApiKey } from '@/entities/app.entity';
import CalculateEculidianDistance, { generatedApiKey, isEmpty } from '@/utils/util';
import { QouteRequest, QouteResponse } from '@/interfaces/quote.interface';
import { Robot } from '@/entities/robot.entity';
import { DeliveryQuote } from '@/entities/quote.entity';
import { Point } from 'geojson';
import { customerOrder } from '@/entities/order.entity';
import { OrderDto } from '@/dtos/order.dts';
import { CancelOrderDto } from '@/dtos/cancelOrder.dto';

@EntityRepository()
class CustomerService {
  public async CustomerKey(customer_id: any): Promise<any> {
    const ApiKey = await generatedApiKey();
    const cus = await CustomerApiKey.create({ apiKey: ApiKey, customer: customer_id }).save();
    return cus;
  }

  public async getCustomerKey(customer_id: any): Promise<any> {
    const customer_key = await CustomerApiKey.findOne({ where: { customer: customer_id } });
    return customer_key;
  }

  public async GetCustomerQuote(quote_data: QouteRequest, customer_id: any): Promise<QouteResponse> {
    const fee = 2.0;
    if (isEmpty(quote_data)) throw new HttpException(400, 'qoute data incorrect');

    const robot = await Robot.find({ where: { availability: true } });

    if (robot.length === 0) {
      throw new HttpException(200, 'no robot is available');
    } else {
      const pick_up_point: Point = {
        type: 'Point',
        coordinates: [quote_data.pick_up_location.lat, quote_data.pick_up_location.lng],
      };

      const drop_off_point: Point = {
        type: 'Point',
        coordinates: [quote_data.drop_off_location.lat, quote_data.drop_off_location.lng],
      };
      const quote = await DeliveryQuote.create({
        pick_up_location: pick_up_point,
        drop_off_location: drop_off_point,
        estimated_price: fee,
        customer: customer_id,
      }).save();
      return quote;
    }
  }

  public async CustomerOrder(customer_id: any, api_data: OrderDto): Promise<any> {
    const dat = [];
    const robot = await Robot.find({ select: ['id', 'history'], relations: ['history'], where: { availability: true } });
    const quote = await DeliveryQuote.findOne({ where: { id: api_data.qoute } });

    //  calculate the eculedian distance between customer and robot co ordinate
    robot.map(data => {
      dat.push({
        robot_id: data.id,
        robot_location: data.history.map((dt): any =>
          CalculateEculidianDistance(
            dt.location.coordinates[0],
            quote.pick_up_location.coordinates[0],
            dt.location.coordinates[1],
            quote.pick_up_location.coordinates[1],
          ),
        )[0],
      });
    });

    //  find the minimum distance
    const assigned_robot = dat.find((dat): any => {
      return Math.min(dat.robot_location);
    });

    const update_robot = await Robot.findOne({ where: { id: assigned_robot.robot_id } });

    const order = await customerOrder.create({
      name: api_data.name,
      description: api_data.description,
      reciever_name: api_data.reciever_name,
      phone: api_data.phone,
      country: api_data.country,
      address: api_data.address,
    });
    order.quote = quote;
    order.customers = customer_id;
    order.robots = update_robot;
    order.save();

    if (order) {
      update_robot.availability = false;
      update_robot.save();
      return order;
    }
  }

  public async CustomerCancelOrder(customer_id: any, order_id: CancelOrderDto): Promise<any> {
    const cancelOrder = await customerOrder.findOne({ where: { id: order_id.order_id, customers: customer_id } });
    cancelOrder.remove();
    if (cancelOrder) {
      const quo = await DeliveryQuote.createQueryBuilder()
        .innerJoin('DeliveryQuote.order', 'order')
        .where('order.id = :id', { id: cancelOrder.id })
        .getOne();
      DeliveryQuote.remove(quo);
      return true;
    } else {
      return new HttpException(400, ' order not found');
    }
  }
}

export default CustomerService;
