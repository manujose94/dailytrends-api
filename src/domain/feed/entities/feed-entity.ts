/**
 * @swagger
 * components:
 *   schemas:
 *     Feed:
 *       type: object
 *       properties:
 *         _id:
 *          type: string
 *         title:
 *           type: string
 *         url:
 *           type: string
 *         publicationDate:
 *           type: string
 *           format: date-time
 *         provider:
 *           type: string
 *         type:
 *           type: string
 */
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
