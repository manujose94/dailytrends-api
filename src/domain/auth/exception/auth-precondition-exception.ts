export class AuthPreconditionException extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "AuthPreconditionException";
  }
}
