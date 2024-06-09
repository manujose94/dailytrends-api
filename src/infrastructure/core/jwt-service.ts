import jwt from 'jsonwebtoken';
import { Config } from '../config/config';


import { IJwtService } from '../../application/ports/security/jwt-service-interface';

export class JwtService implements IJwtService {
  private readonly secretKey: string;

  constructor(secretKey: string = Config.getSecretKey()) {
    this.secretKey = secretKey;
  }

  static getInstance(): JwtService {
    const secretKey = Config.getSecretKey();
    return new JwtService(secretKey);
  }

  sign(payload: object): string {
    try {
      return jwt.sign(payload, this.secretKey);
    } catch (error) {
      throw new Error('Error signing JWT token');
    }
  }

  verify<T extends object>(token: string): T {
    try {
      return jwt.verify(token, this.secretKey) as T;
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }
}