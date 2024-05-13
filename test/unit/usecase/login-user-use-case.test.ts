

import { Encryptor } from '../../../src/adapters/services/encryptor-service';
import { LoginUserUseCase } from '../../../src/adapters/usecase/login-user-use-case';
import IUserRepository from '../../../src/domain/auth/port/user-repository-interface';
import { JwtService } from '../../../src/infrastructure/core/jwt-service';
import { THttpRequest } from '../../../src/common/types/http-types';

describe('LoginUserUseCase', () => {
    let loginUserUseCase: LoginUserUseCase;
    let mockUserRepository: IUserRepository;
    let mockEncryptor: Encryptor;
    let mockJwtService: JwtService;

    beforeEach(() => {
        // Mock dependencies
        mockUserRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        };
        mockEncryptor = {
            compare: jest.fn()
        } as unknown as Encryptor;
        mockJwtService = {
            sign: jest.fn()
        } as unknown as JwtService;

        // Create instance of LoginUserUseCase with mocked dependencies
        loginUserUseCase = new LoginUserUseCase(mockJwtService, mockUserRepository);
        loginUserUseCase['encryptor'] = mockEncryptor; // Set the mock Encryptor directly (for unit test purposes)
    });

    it('should return JWT token when login credentials are valid', async () => {
        // Mock data
        const mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            },
           user: "user",
            // Add the remaining required properties here
        } as  THttpRequest;

        const mockUser = {
            email: 'test@example.com',
            password: 'hashedPassword'
        };

        // Mock repository method to return user
        (mockUserRepository.findByEmail as jest.MockedFunction<typeof mockUserRepository.findByEmail>).mockResolvedValue(mockUser);

        // Mock Encryptor to always return true for password comparison
        (mockEncryptor.compare as jest.MockedFunction<typeof mockEncryptor.compare>).mockResolvedValue(true);

        // Mock JWT sign method
        (mockJwtService.sign as jest.MockedFunction<typeof mockJwtService.sign>).mockReturnValue('mockedToken');

        // Execute the use case
        const result = await loginUserUseCase.login(mockRequest);

        // Assert the result
        expect(result).toEqual('mockedToken');
    });

    it('should throw error when user is not found', async () => {
        // Mock data
        const mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            },
            user: "user",
        } as THttpRequest;

        // Mock repository method to return null (user not found)
        (mockUserRepository.findByEmail as jest.MockedFunction<typeof mockUserRepository.findByEmail>).mockResolvedValue(null);

        // Execute the use case
        await expect(loginUserUseCase.login(mockRequest)).rejects.toThrow('User not found');
    });

    it('should throw error when password is invalid', async () => {
        // Mock data
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

        // Mock repository method to return user
        (mockUserRepository.findByEmail as jest.MockedFunction<typeof mockUserRepository.findByEmail>).mockResolvedValue(mockUser);

        // Mock Encryptor to return false for password comparison
        (mockEncryptor.compare as jest.MockedFunction<typeof mockEncryptor.compare>).mockResolvedValue(false);

        // Execute the use case
        await expect(loginUserUseCase.login(mockRequest)).rejects.toThrow('User not found');
    });
});
