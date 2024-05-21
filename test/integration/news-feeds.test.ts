import request from "supertest";
import { NewsService } from "../../src/adapters/services/news-feed-service";
import { NewsUseCase } from "../../src/adapters/usecase/feed-use-case";
import { FeedEntity } from "../../src/domain/feed/entities/feed-entity";
import createApp from "../../src/infrastructure/server/app";
import { mockAuthenticateToken } from "../mocks/authenticateToken";
jest.mock("../../src/infrastructure/core/jwt-service", () => ({
  JwtService: require("../../test/mocks/JwtService").JwtService
}));
jest.mock("../../src/adapters/services/news-feed-service");
jest.mock("../../src/adapters/usecase/feed-use-case");

describe("NewsFeedsController", () => {
  let newsServiceMock: jest.Mocked<NewsService>;
  let newsUseCaseMock: jest.Mocked<NewsUseCase>;

  beforeEach(() => {
    newsServiceMock = new NewsService(
      null as any,
      null as any
    ) as jest.Mocked<NewsService>;
    newsUseCaseMock = new NewsUseCase(
      newsServiceMock
    ) as jest.Mocked<NewsUseCase>;
    jest.clearAllMocks();
  });

  const app = createApp();
  app.use(mockAuthenticateToken);

  it("should scrape feeds by provider", async () => {
    const mockFeeds: FeedEntity[] = [
      new FeedEntity("Title of New", "URL1", new Date(), "ELMUNDO", "Type1"),
      new FeedEntity("Title of New2", "URL2", new Date(), "ELMUNDO", "Type2")
    ];

    newsUseCaseMock.executeScrape.mockResolvedValue(mockFeeds);

    const response = await request(app)
      .get("/api/v1/news/scrape?provider=ELMUNDO")
      .set("Authorization", "Bearer mocked-jwt-token");

    expect(response.status).toBe(200);
  }, 10000);

  it("should be 401 due to unauthorized", async () => {
    const mockFeeds: FeedEntity[] = [
      new FeedEntity("Title of New", "URL1", new Date(), "ELMUNDO", "Type1"),
      new FeedEntity("Title of New2", "URL2", new Date(), "ELMUNDO", "Type2")
    ];

    newsUseCaseMock.executeScrape.mockResolvedValue(mockFeeds);

    const response = await request(app).get(
      "/api/v1/news/scrape?provider=ELMUNDO"
    );

    expect(response.status).toBe(401);
  }, 10000);
});
