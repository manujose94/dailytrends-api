// test/integration/news-controller.test.ts
import request from "supertest";
import app from "../../src/infrastructure/server/app"; // Adjust the path accordingly
import { NewsService } from "../../src/adapters/services/news-feed-service"; // Adjust the path accordingly
import { NewsUseCase } from "../../src/adapters/usecase/feed-use-case"; // Adjust the path accordingly
import { FeedEntity } from "../../src/domain/feed/entities/feed-entity"; // Adjust the path accordingly
import createApp from "../../src/infrastructure/server/app"; // Adjust the path accordingly
import { mockAuthenticateToken } from "../mocks/authenticateToken";
jest.mock("../../src/infrastructure/core/jwt-service", () => ({
  JwtService: require("../../test/mocks/JwtService").JwtService
}));
jest.mock("../../src/adapters/services/news-feed-service");
jest.mock("../../src/adapters/usecase/feed-use-case");

describe("NewsController", () => {
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

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  const app = createApp();
  app.use(mockAuthenticateToken);

  it("should scrape feeds by provider", async () => {
    const mockFeeds: FeedEntity[] = [
      new FeedEntity("Title1", "URL1", new Date(), "Provider1", "Type1"),
      new FeedEntity("Title2", "URL2", new Date(), "Provider1", "Type2")
    ];

    newsUseCaseMock.executeScrape.mockResolvedValue(mockFeeds);

    const response = await request(app)
      .get("/api/v1/news/scrape?provider=Provider1")
      .set("Authorization", "Bearer mocked-jwt-token");

    expect(response.status).toBe(200);
    //expect(response.body.feeds).toEqual(mockFeeds);
    //expect(newsUseCaseMock.executeScrape).toHaveBeenCalledWith("Provider1");
  }, 10000);
  it("should be 401 due to unauthorized", async () => {
    const mockFeeds: FeedEntity[] = [
      new FeedEntity("Title1", "URL1", new Date(), "Provider1", "Type1"),
      new FeedEntity("Title2", "URL2", new Date(), "Provider1", "Type2")
    ];

    newsUseCaseMock.executeScrape.mockResolvedValue(mockFeeds);

    const response = await request(app).get(
      "/api/v1/news/scrape?provider=Provider1"
    );

    expect(response.status).toBe(401);
  }, 10000);
});
