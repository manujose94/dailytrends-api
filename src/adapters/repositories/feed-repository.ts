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

  constructor() {
    super(FEED_MODEL);
  }

  async getFeeds(): Promise<FeedEntity[]> {
    return this.model
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

  //TODO: REVIEW THIS
  async getFeedsByDate(date: Date): Promise<FeedEntity[]> {
    const feeds = await this.model.find({ publicationDate: date }).lean();
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
    const feeds = await this.model.find({ provider }).exec();
    return feeds;
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

    const feeds = await this.model.aggregate(aggregationPipeline).exec();
    return feeds;
  }

  async create(feed: FeedEntity): Promise<string | null> {
    feed.provider = normalizeProviderName(feed.provider);
    try {
      const result = await this.model.updateOne(
        { title: feed.title, publicationDate: feed.publicationDate },
        feed,
        { upsert: true, new: true }
      );
      if (result.upsertedId) {
        return result.upsertedId._id.toString();
      }
      return null;
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return null;
      } else {
        throw error;
      }
    }
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({
      id: id
    });
  }
}
