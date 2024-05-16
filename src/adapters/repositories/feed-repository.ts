import { normalizeProviderName } from "../../common/utils/normalize-provider-name";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";
import { FEED_MODEL, IFeed } from "../../domain/feed/models/feed-model";
import IFeedRepository from "../../domain/port/feeds-repository-interface";
import { isDuplicateKeyError } from "../../common/utils/error-utils";
import { BaseRepository } from "./base-repository";

export class FeedRepository
  extends BaseRepository<IFeed>
  implements IFeedRepository
{
  private feedModel = FEED_MODEL;

  constructor() {
    super(FEED_MODEL);
  }

  async getFeeds(): Promise<FeedEntity[]> {
    return this.feedModel
      .find()
      .lean()
      .then((feeds) => {
        return feeds.map(
          (feed) =>
            new FeedEntity(
              feed.title,
              feed.url,
              feed.publicationDate,
              feed.provider,
              feed.type
            )
        );
      });
  }

  async getFeedsByDate(date: Date): Promise<FeedEntity[]> {
    const feeds = await this.feedModel.find({ publicationDate: date }).lean();
    return feeds.map(
      (feed) =>
        new FeedEntity(
          feed.title,
          feed.url,
          feed.publicationDate,
          feed.provider,
          feed.type
        )
    );
  }

  async getFeedsByProviderName(provider: string): Promise<FeedEntity[]> {
    const feeds = await this.feedModel.find({ provider }).lean();
    return feeds.map(
      (feed) =>
        new FeedEntity(
          feed.title,
          feed.url,
          feed.publicationDate,
          feed.provider,
          feed.type
        )
    );
  }

  async getFeedsByProvider(limitPerProvider?: number): Promise<FeedEntity[]> {
    const aggregationPipeline = [
      {
        $group: {
          _id: "$provider",
          feeds: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          provider: "$_id",
          feeds: {
            $slice: limitPerProvider ? ["$feeds", limitPerProvider] : "$feeds"
          }
        }
      },
      {
        $unwind: "$feeds"
      },
      {
        $replaceRoot: { newRoot: "$feeds" }
      }
    ];

    const result = await this.feedModel.aggregate(aggregationPipeline).exec();

    return result.map(
      (feed) =>
        new FeedEntity(
          feed.title,
          feed.url,
          feed.publicationDate,
          feed.provider,
          feed.type
        )
    );
  }

  async create(feed: FeedEntity): Promise<void> {
    feed.provider = normalizeProviderName(feed.provider);
    try {
      await this.feedModel.updateOne(
        { title: feed.title, publicationDate: feed.publicationDate },
        feed,
        { upsert: true }
      );
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return;
      } else {
        throw error;
      }
    }
  }

  async delete(id: string): Promise<void> {
    await this.feedModel.deleteOne({
      id: id
    });
  }
}
