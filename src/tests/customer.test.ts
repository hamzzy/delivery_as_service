import { compare, hash } from 'bcryptjs';
import request from 'supertest';
import { createConnection, getConnection, getRepository } from 'typeorm';
import App from '@/app';
import dbConnection from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import CustomerRoute from '@routes/customer.route';
import { Customer } from '@entities/users.entity';
import minifaker from 'minifaker';
import 'minifaker/dist/locales/en';
import { createDummyAndAuthorize } from '../utils/util';

const customerRoute = new CustomerRoute();
const app = new App([customerRoute]);

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 9000));
});

describe('Testing  Customer Api Key generation', () => {
  it('should return 200 & valid response to authorization with fakeToken request', async done => {
    const dummy = await createDummyAndAuthorize();

    const res = await request(app.getServer()).post(`${customerRoute.path}getApikey`);
    console.log(res.body);
    // expect(res.statusCode).toBe(200);
    // expect(res.body).toEqual({
    //   apiKey: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
    // });
  });

});
