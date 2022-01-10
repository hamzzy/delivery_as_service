import { Customer } from '@/entities/users.entity';
import AuthService from '@/services/auth.service';
import { hash } from 'bcryptjs';
import minifaker from 'minifaker';
import 'minifaker/dist/locales/en';
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

export function dummy() {
  return {
    email: minifaker.email(),
    password: minifaker.password.generate(),
  };
}

export async function createDummy(): Promise<DummyUser> {
  const user = dummy();
  const dbUser = await Customer.create(user);
  await dbUser.save();
  return { ...user, userId: dbUser.id };
}

export async function createDummyAndAuthorize(): Promise<AuthorizedDummyUser> {
  const user = await createDummy();
  const UserService = new AuthService();
  const authToken = await UserService.createToken(user.userId);
  return { ...user, token: authToken.token };
}

// export async function deleteUser(userId: string): Promise<void> {
//   const dbUser = await Customer.findOne({ where: { id: userId } });
//   await dbUser.remove(dbUser)
// }
function ApiKey() {
  let d = new Date().getTime();

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

  return uuid;
}
export async function generatedApiKey(): Promise<string> {
  const apiKey = await ApiKey();
  const hashedApiKey = await hash(apiKey, 10);
  return hashedApiKey;
}
