import { Encryptor } from "src/adapters/services/encryptor-service";

import { RegisterUserUseCase } from "../../../src/adapters/usecase/register-user-use-case";
import { THttpRequest } from "src/common/types/http-types";
import IUserRepository from "src/domain/port/user-repository-interface";
describe("RegisterUserUseCase", () => {
  let registerUserUseCase: RegisterUserUseCase;
  let mockUserRepository: IUserRepository;
  let mockEncryptor: Encryptor;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      read: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    };
    mockEncryptor = {
      hash: jest.fn(),
    } as unknown as Encryptor;

    registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
    registerUserUseCase["encryptor"] = mockEncryptor;
  });

  it("should register a new user", async () => {
    // Mock data
    const mockRequest = {
      body: {
        email: "test@example.com",
        password: "password123"
      }
    } as THttpRequest;

    const mockUser = null;

    (
      mockUserRepository.findByEmail as jest.MockedFunction<
        typeof mockUserRepository.findByEmail
      >
    ).mockResolvedValue(mockUser);

    (
      mockEncryptor.hash as jest.MockedFunction<typeof mockEncryptor.hash>
    ).mockResolvedValue("hashedPassword");

    const result = await registerUserUseCase.register(mockRequest);

    expect(result).toEqual("Registration successful");

    expect(mockUserRepository.create).toHaveBeenCalledWith({
      email: mockRequest.body.email,
      password: "hashedPassword"
    });
  });

  it("should throw error when user already exists", async () => {
    const mockRequest = {
      body: {
        email: "test@example.com",
        password: "password123"
      }
    } as THttpRequest;

    const mockUser = {
      email: "test@example.com",
      password: "hashedPassword"
    };

    (
      mockUserRepository.findByEmail as jest.MockedFunction<
        typeof mockUserRepository.findByEmail
      >
    ).mockResolvedValue(mockUser);

    await expect(registerUserUseCase.register(mockRequest)).rejects.toThrow(
      "Email already in use"
    );
  });
});
