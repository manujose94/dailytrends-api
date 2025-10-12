export interface IDeleteUserCase {
    deleteUserByToken(token: string): Promise<string>;
  }
  