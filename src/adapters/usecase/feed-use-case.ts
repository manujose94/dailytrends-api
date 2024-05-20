import { NewsService } from "../services/news-feed-service";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";
import { IFeedUserCase } from "../../domain/feed/usecase/feed-use-case-interface";
import { normalizeProviderName } from "../../common/utils/normalize-provider-name";
import { FeedData } from "./dto/feed-data-dto";
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
    await this.newsService.saveFeeds(feeds);
    return feeds;
  }

  async executeScrapeAll(limit?: number): Promise<FeedEntity[]> {
    const allFeeds = await this.newsService.scrapeAndGetAllFeeds(limit);
    const feedsByProvider: { [key: string]: FeedEntity[] } = {};
    allFeeds.forEach((feed) => {
      if (!feedsByProvider[feed.provider]) {
        feedsByProvider[feed.provider] = [];
      }
      feedsByProvider[feed.provider].push(feed);
    });
  
    return allFeeds;
  }

  async getFeedsByProvider(limit?: number): Promise<FeedEntity[]> {
    return await this.newsService.getFeedsByProvider(limit);
  }

  async getFeedsByProviderName(provider: string): Promise<FeedEntity[]> {
    return await this.newsService.getFeedsByProviderName(provider);
  }

  async create(feedData: FeedData): Promise<string | null> {
    const feed = new FeedEntity(
      feedData.title,
      feedData.url,
      new Date(),
      normalizeProviderName(feedData.provider),
      feedData.type
    );
    return await this.newsService.create(feed);
  }

  async read(id: string): Promise<FeedEntity | null> {
    return await this.newsService.read(id);
  }

  async update(id: string, feedData: Partial<FeedData>): Promise<boolean | null> {
    const existingFeed = await this.newsService.read(id);

    if (!existingFeed) {
      return null;
    }
    const updatedFeed = new FeedEntity(
      feedData.title ?? existingFeed.title,
      feedData.url ?? existingFeed.url,
      new Date(), // Assuming you want to update the date to the current date
      normalizeProviderName(feedData.provider ?? existingFeed.provider),
      feedData.type ?? existingFeed.type
    );
    return await this.newsService.update(id, updatedFeed);
  }

  async delete(id: string): Promise<void> {
    await this.newsService.delete(id);
  }

  async list(limit?: number): Promise<FeedEntity[]> {
    return await this.newsService.list(limit);
  }
}
