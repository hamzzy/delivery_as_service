import { Customer } from '@/entities/users.entity';
import AuthService from '@/services/auth.service';
import { hash } from 'bcryptjs';
import minifaker from 'minifaker';
import 'minifaker/dist/locales/en';
import { ValidationOptions, registerDecorator, ValidationArguments, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { Robot } from '@/entities/robot.entity';
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

export function get_random(list) {
  return list[Math.floor(Math.random() * list.length)];
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

export async function createDummyRobot() {
  
}
// export async function deleteUser(userId: string): Promise<void> {
//   const dbUser = await Customer.findOne({ where: { id: userId } });
//   await dbUser.remove(dbUser)
// }

export async function generatedApiKey(): Promise<string> {
  const apiKey = uuidv4();
  const hashedApiKey = await hash(apiKey, 10);
  return hashedApiKey;
}

/**
 * @decorator
 * @description A custom decorator to validate a validation-schema within a validation schema upload N levels
 * @param schema The validation Class
 */
export function ValidateNested(schema: new () => any, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateNested',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          args.value;
          if (Array.isArray(value)) {
            for (let i = 0; i < (<Array<any>>value).length; i++) {
              if (validateSync(plainToClass(schema, value[i])).length) {
                return false;
              }
            }
            return true;
          } else return validateSync(plainToClass(schema, value)).length ? false : true;
        },
        defaultMessage(args) {
          if (Array.isArray(args.value)) {
            for (let i = 0; i < (<Array<any>>args.value).length; i++) {
              return (
                `${args.property}::index${i} -> ` +
                validateSync(plainToClass(schema, args.value[i]))
                  .map(e => e.constraints)
                  .reduce((acc, next) => acc.concat(Object.values(next)), [])
              ).toString();
            }
          } else
            return (
              `${args.property}: ` +
              validateSync(plainToClass(schema, args.value))
                .map(e => e.constraints)
                .reduce((acc, next) => acc.concat(Object.values(next)), [])
            ).toString();
        },
      },
    });
  };
}

export default function CalculateEculidianDistance(lat1: Number, lat2: Number, lng1: Number, lng2: Number) {
  const distance = Math.sqrt(Math.pow(Number(lat1) - Number(lat2), 2) + Math.pow(Number(lng1) - Number(lng2), 2));
  return distance;
}
