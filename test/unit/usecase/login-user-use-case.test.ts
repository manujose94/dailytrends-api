

import { Encryptor } from '../../../src/adapters/services/encryptor-service';
import { LoginUserUseCase } from '../../../src/adapters/usecase/login-user-use-case';
import IUserRepository from "src/domain/port/user-repository-interface";
import { JwtService } from '../../../src/infrastructure/core/jwt-service';
import { THttpRequest } from '../../../src/common/types/http-types';

describe('LoginUserUseCase', () => {
    let loginUserUseCase: LoginUserUseCase;
    let mockUserRepository: IUserRepository;
    let mockEncryptor: Encryptor;
    let mockJwtService: JwtService;
    let messageError = 'Operation login failed';
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
            compare: jest.fn()
        } as unknown as Encryptor;
        mockJwtService = {
            sign: jest.fn()
        } as unknown as JwtService;

        loginUserUseCase = new LoginUserUseCase(mockJwtService, mockUserRepository);
        loginUserUseCase['encryptor'] = mockEncryptor;
    });

  it("should return JWT token when login credentials are valid", async () => {
    const mockRequest = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    } as unknown as THttpRequest;

    const mockUser = {
      email: "test@example.com",
      password: "hashedPassword",
    };

    (
      mockUserRepository.findByEmail as jest.MockedFunction<
        typeof mockUserRepository.findByEmail
      >
    ).mockResolvedValue(mockUser);

    (
      mockEncryptor.compare as jest.MockedFunction<typeof mockEncryptor.compare>
    ).mockResolvedValue(true);

    (
      mockJwtService.sign as jest.MockedFunction<typeof mockJwtService.sign>
    ).mockReturnValue("mockedToken");

    const result = await loginUserUseCase.login(mockRequest);

    expect(result).toEqual("mockedToken");
  });

    it('should throw error when user is not found', async () => {

        const mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            },
            user: "user",
        } as unknown as THttpRequest;

        (mockUserRepository.findByEmail as jest.MockedFunction<typeof mockUserRepository.findByEmail>).mockResolvedValue(null);

        await expect(loginUserUseCase.login(mockRequest)).rejects.toThrow(messageError);
    });

    it('should throw error when password is invalid', async () => {

        const mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            }
        } as THttpRequest;

        const mockUser = {
            email: 'test@example.com',
            password: 'hashedPassword'
        };

        (mockUserRepository.findByEmail as jest.MockedFunction<typeof mockUserRepository.findByEmail>).mockResolvedValue(mockUser);

        (mockEncryptor.compare as jest.MockedFunction<typeof mockEncryptor.compare>).mockResolvedValue(false);

        await expect(loginUserUseCase.login(mockRequest)).rejects.toThrow(messageError);
    });
});
