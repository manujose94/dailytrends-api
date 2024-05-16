export class FeedEntity {
  title: string;
  url: string;
  publicationDate: Date;
  provider: string;
  type: string;

  constructor(
    title: string,
    url: string,
    publicationDate: Date,
    provider: string,
    type: string
  ) {
    this.title = title;
    this.url = url;
    this.publicationDate = publicationDate;
    this.provider = provider;
    this.type = type;
  }
}
