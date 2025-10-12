export class UnauthorizedException extends Error {
    public readonly statusCode: number;
  
    constructor(message: string = "Unauthorized") {
      super(message);
      this.name = "UnauthorizedException";
      this.statusCode = 401;
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, UnauthorizedException);
      }
    }
  }
  