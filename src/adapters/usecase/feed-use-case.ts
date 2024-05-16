import { NewsService } from "../services/news-feed-service";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";
import { IFeedUserCase } from "../../domain/feed/usecase/feed-use-case-interface";

export class NewsUseCase implements IFeedUserCase {
  private newsService: NewsService;

  constructor(newsService: NewsService) {
    this.newsService = newsService;
  }
  async executeScrape(providerName: string): Promise<FeedEntity[]> {
    const feeds = await this.newsService.scrapeAndGetFeeds(providerName);
    const feed_cut = feeds.slice(0, 5);
    await this.newsService.saveFeeds(feed_cut);
    return feeds.slice(0, 5); // Return the first five feeds
  }

  async executeScrapeAll(): Promise<FeedEntity[]> {
    const allFeeds = await this.newsService.scrapeAndGetAllFeeds();
    const feedsByProvider: { [key: string]: FeedEntity[] } = {};

    // Group feeds by provider
    allFeeds.forEach((feed) => {
      if (!feedsByProvider[feed.provider]) {
        feedsByProvider[feed.provider] = [];
      }
      feedsByProvider[feed.provider].push(feed);
    });

    // Get the first 5 feeds from each provider and flatten the result
    const result = Object.values(feedsByProvider)
      .map((feeds) => feeds.slice(0, 5))
      .flat();

    return result;
  }

  async getFeedsByProvider(limit: number): Promise<FeedEntity[]> {
    return await this.newsService.getFeedsByProvider(limit);
  }

  async getFeedsByProviderName(provider: string): Promise<FeedEntity[]> {
    return await this.newsService.getFeedsByProviderName(provider);
  }

  async create(feed: FeedEntity): Promise<string> {
    return await this.newsService.create(feed);
  }
}
