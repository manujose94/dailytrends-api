import { normalizeProviderName } from "../../common/utils/normalize-provider-name";
import { FeedEntity } from "../../domain/feeds/entities/feed-entity";
import { FEED_MODEL } from "../../domain/auth/models/feed-model";
import IFeedRepository from "../../domain/auth/port/feeds-repository-interface";

export class FeedRepository implements IFeedRepository {
  private feedModel = FEED_MODEL;

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

  async getFeedsByProvider(limitPerProvider: number): Promise<FeedEntity[]> {
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
          feeds: { $slice: ["$feeds", limitPerProvider] }
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
    await this.feedModel.updateOne(
      { title: feed.title, publicationDate: feed.publicationDate },
      feed,
      { upsert: true }
    );
  }

  async delete(feed: FeedEntity): Promise<void> {
    await this.feedModel.deleteOne({
      title: feed.title,
      publicationDate: feed.publicationDate
    });
  }
}
