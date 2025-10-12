export class FeedPreconditionException extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "FeedPreconditionException";
  }
}
