export class DuplicateKeyError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "DuplicateKeyError";
    }
  }