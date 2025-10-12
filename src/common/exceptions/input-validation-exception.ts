export class InputValidationException extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "InputValidationException";
  }
}
