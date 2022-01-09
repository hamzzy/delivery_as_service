import { compare, hash } from 'bcryptjs';
import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import App from '@/app';
import dbConnection from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import AuthRoute from '@routes/auth.route';
import { Customer } from '@entities/users.entity';
// import faker from 'faker';
beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing  User Database', () => {
  it('should create user', async () => {
    const email = 'adn@mail.com';
    const password = await hash('helloword', 10);

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
        email: 'tes@email.com',
        password: 'q1w2e3r4!',
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
      return request(app.getServer()).post(`${authRoute.path}signup`).send(userData).expect(201);
    });
  });

  //   describe('[POST] /login', () => {
  //     it('response should have the Set-Cookie header with the Authorization token', async () => {
  //       const userData: CreateUserDto = {
  //         email: 'test@email.com',
  //         password: 'q1w2e3r4!',
  //       };

  //       const authRoute = new AuthRoute();
  //       const users = authRoute.authController.authService.users;
  //       const userRepository = getRepository(users);

  //       userRepository.findOne = jest.fn().mockReturnValue({
  //         id: 1,
  //         email: userData.email,
  //         password: await bcrypt.hash(userData.password, 10),
  //       });

  //       const app = new App([authRoute]);
  //       return request(app.getServer())
  //         .post(`${authRoute.path}login`)
  //         .send(userData)
  //         .expect('Set-Cookie', /^Authorization=.+/);
  //     });
  //   });

});
