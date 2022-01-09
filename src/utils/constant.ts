import jwt, { SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken';

export const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '14d',
};
