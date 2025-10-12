export class FeedConditionException extends Error {
    constructor(message: string | undefined) {
      super(message);
      this.name = "FeedConditionException";
    }
  }