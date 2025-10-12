export interface IJwtService {
    sign(payload: object): string;
    verify<T extends object>(token: string): T;
  }