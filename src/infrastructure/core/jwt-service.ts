import jwt from 'jsonwebtoken';
import { Config } from '../config/config';


export class JwtService {
  private readonly secretKey: string;

  constructor(secretKey: string = Config.getSecretKey()) {
    this.secretKey = secretKey;
  }

  static getInstance(): JwtService {
    const secretKey = Config.getSecretKey();
    return new JwtService(secretKey);
  }

  sign(payload: any): string {
        try {
          console.log(this.secretKey)
      return jwt.sign(payload, this.secretKey);
    } catch (error) {
      // Handle error gracefully
      throw new Error('Error signing JWT token');
    }
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      // Handle error gracefully
      throw new Error('Invalid JWT token');
    }
  }
}