import { compare, hash } from 'bcryptjs';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { Customer } from '../entities/users.entity';
import { HttpException } from '../exceptions/HttpException';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import { isEmpty } from '../utils/util';

@EntityRepository()
class AuthService extends Repository<Customer> {
  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await Customer.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await Customer.create({ ...userData, password: hashedPassword }).save();
    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ tokenData: TokenData }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await Customer.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `You're email ${findUser.email} not found`);
    
    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser);

    return { tokenData };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = 2 * 604800;

    return { token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
}

export default AuthService;
