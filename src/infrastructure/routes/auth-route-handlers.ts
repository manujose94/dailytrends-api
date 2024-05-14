import { Request, Response } from 'express';
import { JwtService } from '../core/jwt-service';
import { UserAuthController } from '../../adapters/controllers/auth/user-auth-controller';
import { THttpRequest } from '../../common/types/http-types';

const jwtService = new JwtService();
const authController = new UserAuthController(jwtService);

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const typedReq = req as THttpRequest;
    const response = await authController.login(typedReq);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const RegisterHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const typedReq = req as THttpRequest;
    const response = await authController.register(typedReq);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};