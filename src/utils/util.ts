import { Customer } from '@/entities/users.entity';
import AuthService from '@/services/auth.service';
import bcrypt from 'bcrypt';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export interface DummyUser {
  email: string;
  password: any;
  userId: any;
}
export interface AuthorizedDummyUser {
  token: string;
}

// export function dummy() {
//   return {
//     email: faker.internet.email(),
//     password: faker.internet.password(),
//   };
// }

// export async function createDummy(): Promise<DummyUser> {
//   const user = dummy();
//   const dbUser = Customer.create(user);
//   await dbUser.save();
//   return { ...user, userId: dbUser.id };
// }

// export async function createDummyAndAuthorize(): Promise<AuthorizedDummyUser> {
//   const user = await createDummy();
//   const UserService = new AuthService();
//   const authToken = UserService.createToken(user.userId);
//   return { ...user, token: authToken.token };
// }

// export async function deleteUser(userId: string): Promise<void> {
//   const dbUser = await Customer.findOne({ where: { id: userId } });
//   await dbUser.remove(dbUser)
// }
