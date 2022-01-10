import { compare, hash } from 'bcryptjs';
import request from 'supertest';
import { createConnection, getConnection, getRepository } from 'typeorm';
import App from '@/app';
import dbConnection from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import AuthRoute from '@routes/auth.route';
import { Customer } from '@entities/users.entity';
import minifaker from 'minifaker';
import 'minifaker/dist/locales/en';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing  User Database', () => {
  test('should create user', async () => {
    const email = minifaker.email();
    const password = minifaker.password.generate();

    const user = new Customer();
    user.email = email;
    user.password = password;
    await user.save();

    const fetched = await Customer.findOne(user.id);

    expect(fetched).not.toBeNull();

    expect(fetched?.email).toBe(email);
    expect(fetched?.password).toBe(password);
  });
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: minifaker.email(),
        password: minifaker.password.generate(),
      };

      const authRoute = new AuthRoute();
      const users = Customer;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue(null);
      userRepository.save = jest.fn().mockReturnValue({
        email: userData.email,
        password: await hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      const res = await request(app.getServer()).post(`${authRoute.path}signup`).send(userData);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toMatchObject({
        message: 'signup',
      });
    });

    // it('should return 409 & valid response for duplicated user', async () => {
    //   const userData: CreateUserDto = {
    //     email: minifaker.email(),
    //     password: minifaker.password.generate(),
    //   };

    //   const authRoute = new AuthRoute();
    //   const users = Customer;
    //   const userRepository = getRepository(users);

    //   userRepository.findOne = jest.fn().mockReturnValue(null);
    //   userRepository.save = jest.fn().mockReturnValue({
    //     email: userData.email,
    //     password: await hash(userData.password, 10),
    //   });

    //   const app = new App([authRoute]);
    //   await request(app.getServer()).post(`${authRoute.path}signup`).send(userData);

    //   const res = await request(app.getServer()).post(`${authRoute.path}signup`).send(userData);
    //   expect(res.body).toMatchObject({
    //     message: `You're email ${userData.email} already exists`,
    //   });
    // });
  });

  describe('[POST] /login', () => {
    it('response should have Authorization token', async () => {
      const userData: CreateUserDto = {
        email: minifaker.email(),
        password: minifaker.password.generate(),
      };

      const authRoute = new AuthRoute();
      const users = Customer;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue({
        email: userData.email,
        password: await hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      const res = await request(app.getServer()).post(`${authRoute.path}login`).send(userData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
      });
    });
  });
});
