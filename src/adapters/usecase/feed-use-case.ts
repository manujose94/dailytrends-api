import { NewsService } from "../services/news-feed-service";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";
import { IFeedUserCase } from "../../domain/feed/usecase/feed-use-case-interface";

export class NewsUseCase implements IFeedUserCase {
  private newsService: NewsService;

  constructor(newsService: NewsService) {
    this.newsService = newsService;
  }
  async executeScrape(
    providerName: string,
    limit?: number
  ): Promise<FeedEntity[]> {
    const feeds = await this.newsService.scrapeAndGetFeeds(providerName, limit);
    //const firstFeeds = feeds.slice(0, 5);
    await this.newsService.saveFeeds(feeds);
    return feeds;
  }

  async executeScrapeAll(): Promise<FeedEntity[]> {
    const allFeeds = await this.newsService.scrapeAndGetAllFeeds();
    const feedsByProvider: { [key: string]: FeedEntity[] } = {};
    allFeeds.forEach((feed) => {
      if (!feedsByProvider[feed.provider]) {
        feedsByProvider[feed.provider] = [];
      }
      feedsByProvider[feed.provider].push(feed);
    });
    const result = Object.values(feedsByProvider)
      .map((feeds) => feeds.slice(0, 5))
      .flat();
    return result;
  }

  async getFeedsByProvider(limit?: number): Promise<FeedEntity[]> {
    return await this.newsService.getFeedsByProvider(limit);
  }

  async getFeedsByProviderName(provider: string): Promise<FeedEntity[]> {
    return await this.newsService.getFeedsByProviderName(provider);
  }

  async create(feed: FeedEntity): Promise<string> {
    return await this.newsService.create(feed);
  }

  async read(id: string): Promise<FeedEntity | null> {
    return await this.newsService.read(id);
  }

  async update(id: string, feed: Partial<FeedEntity>): Promise<boolean | null> {
    return await this.newsService.update(id, feed);
  }

  async delete(id: string): Promise<void> {
    await this.newsService.delete(id);
  }

  async list(limit?: number): Promise<FeedEntity[]> {
    return await this.newsService.list(limit);
  }
}
