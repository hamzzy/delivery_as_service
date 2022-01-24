import { compare, hash } from 'bcryptjs';
import request from 'supertest';
import { createConnection, getConnection, getRepository } from 'typeorm';
import App from '@/app';
import dbConnection from '../ormconfig';
import { CreateUserDto } from '@dtos/users.dto';
import CustomerRoute from '@routes/customer.route';
import { Customer } from '@entities/users.entity';
import { Robot } from '../entities/robot.entity';
import { email, password, latidude, longitude, word } from 'minifaker';
import 'minifaker/dist/locales/en';
import { RobotLocationHistory } from '../entities/robotMovement.entity';
import { createDummyAndAuthorize } from '../utils/util';
import { Point } from 'geojson';
import { customerOrder } from '../entities/order.entity';

let conn: any;
beforeAll(async () => {
  conn = await createConnection(dbConnection);
});

afterAll(async () => {
  jest.useRealTimers();
  await conn.synchronize(true);
  await conn.close();
});

const customerRoute = new CustomerRoute();
const app = new App([customerRoute]);

describe('Testing  Customer Api Key generation', () => {
  test('should return 201 &  Api key ', async () => {
    const dummy = await createDummyAndAuthorize();

    const res = await request(app.getServer()).post(`${customerRoute.path}createApikey`).set('Authorization', `Bearer ${dummy.token}`);
    expect(res.statusCode).toBe(201);
  });

  test('should return 400 & apikey Created  ', async () => {
    const dummy = await createDummyAndAuthorize();

    const res = await request(app.getServer()).post(`${customerRoute.path}createApikey`).set('Authorization', `Bearer ${dummy.token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ message: 'key Created already' });
  });
});

describe('Testing  Customer  Quote', () => {
  test('should not create customer quote', async () => {
    const dummy = await createDummyAndAuthorize();
    const robot = await Robot.create({ name: word(), availability: false });
    robot.save();
    const qoute_data = {
      pick_up_location: {
        lat: latidude(),
        lng: longitude(),
      },
      drop_off_location: {
        lat: latidude(),
        lng: longitude(),
      },
    };

    const res = await request(app.getServer()).get(`${customerRoute.path}getApikey`).set('Authorization', `Bearer ${dummy.token}`);
    const res2 = await request(app.getServer()).post(`${customerRoute.path}quote`).set({ 'x-api-key': res.body.api_key }).send(qoute_data);
    expect(res.statusCode).toBe(200);
    expect(res2.body).toMatchObject({ message: 'no robot is available' });
  });

  test('should create customer quote', async () => {
    const dummy = await createDummyAndAuthorize();
    const robot = await Robot.create({ name: word(), availability: true });
    robot.save();

    const qoute_data = {
      pick_up_location: {
        lat: latidude(),
        lng: longitude(),
      },
      drop_off_location: {
        lat: latidude(),
        lng: longitude(),
      },
    };

    const res = await request(app.getServer()).get(`${customerRoute.path}getApikey`).set('Authorization', `Bearer ${dummy.token}`);
    const res2 = await request(app.getServer()).post(`${customerRoute.path}quote`).set({ 'x-api-key': res.body.api_key }).send(qoute_data);
    expect(res2.statusCode).toBe(201);
    expect(res2.body).toMatchObject({
      qoute_id: expect.stringMatching(/^[A-Za-z0-9-_=]/),
      estimated_fee: 2,
    });
  });
});

describe('Testing  Customer Order', () => {
  test('should create customer Order', async () => {
    const dummy = await createDummyAndAuthorize();
    const robot = await Robot.create({ name: word(), availability: true }).save();

    const location: Point = {
      type: 'Point',
      coordinates: [Number(latidude()), Number(longitude())],
    };
    const robot_loc = RobotLocationHistory.create({ location: location, robot: robot });
    robot_loc.save();

    const qoute_data = {
      pick_up_location: {
        lat: latidude(),
        lng: longitude(),
      },
      drop_off_location: {
        lat: latidude(),
        lng: longitude(),
      },
    };

    const res = await request(app.getServer()).get(`${customerRoute.path}getApikey`).set('Authorization', `Bearer ${dummy.token}`);
    const res2 = await request(app.getServer()).post(`${customerRoute.path}quote`).set({ 'x-api-key': res.body.api_key }).send(qoute_data);

    const order_data = {
      name: 'An hand bag',
      description: 'an hand bag delivery',
      reciever_name: 'john doe',
      phone: '+23489948904',
      country: 'lagos',
      address: '19, colleg nun',
      qoute: res2.body.qoute_id,
    };
    const res3 = await request(app.getServer()).post(`${customerRoute.path}order`).set({ 'x-api-key': res.body.api_key }).send(order_data);    
    expect(res3.statusCode).toBe(201);
  });
});
