import { FeedEntity } from "../../../domain/feed/entities/feed-entity";


export interface INewsService {
    scrapeAndGetFeeds(providerName: string, limit?: number): Promise<FeedEntity[]>;
    scrapeAndGetAllFeeds(limit?: number): Promise<FeedEntity[]>;
    saveFeeds(feeds: FeedEntity[]): Promise<void>;
    getFeeds(): Promise<FeedEntity[]>;
    getFeedsByProviderName(name: string): Promise<FeedEntity[]>;
    getFeedsByProvider(limit?: number): Promise<FeedEntity[]>;
    deleteFeeds(filter: { _id?: string; publicationDate?: { $lt?: Date }; provider?: string }): Promise<void>;
    create(feed: FeedEntity): Promise<string | null>;
    read(id: string): Promise<FeedEntity | null>;
    update(id: string, feed: Partial<FeedEntity>): Promise<boolean | null>;
    delete(id: string): Promise<void>;
    list(limit?: number): Promise<FeedEntity[]>;
  }