import { Encryptor } from 'src/adapters/services/encryptor-service';
import IUserRepository from '../../../src/domain/auth/port/user-repository-interface';
import { RegisterUserUseCase } from '../../../src/adapters/usecase/register-user-use-case';
import { THttpRequest } from 'src/common/types/http-types';
describe('RegisterUserUseCase', () => {
    let registerUserUseCase: RegisterUserUseCase;
    let mockUserRepository: IUserRepository;
    let mockEncryptor: Encryptor;

    beforeEach(() => {
        // Mock dependencies
        mockUserRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        };
        mockEncryptor = {
            hash: jest.fn()
        } as unknown as Encryptor;

        // Create instance of RegisterUserUseCase with mocked dependencies
        registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
        registerUserUseCase['encryptor'] = mockEncryptor; // Set the mock Encryptor directly (for unit test purposes)
    });

    it('should register a new user', async () => {
        // Mock data
        const mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            }
        } as  THttpRequest;

        const mockUser = null; // User doesn't exist (mocked)

        // Mock repository method to return null (user not found)
        (mockUserRepository.findByEmail as jest.MockedFunction<typeof mockUserRepository.findByEmail>).mockResolvedValue(mockUser);

        // Mock Encryptor hash method
        (mockEncryptor.hash as jest.MockedFunction<typeof mockEncryptor.hash>).mockResolvedValue('hashedPassword');

        // Execute the use case
        const result = await registerUserUseCase.register(mockRequest);

        // Assert the result
        expect(result).toEqual('User created');

        // Assert that the repository create method was called with the correct parameters
        expect(mockUserRepository.create).toHaveBeenCalledWith({
            email: mockRequest.body.email,
            password: 'hashedPassword' // Make sure password is hashed
        });
    });

    it('should throw error when user already exists', async () => {
        // Mock data
        const mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            }
        } as  THttpRequest;

        const mockUser = {
            email: 'test@example.com',
            password: 'hashedPassword'
        };

      

        // Mock repository method to return an existing user
        (mockUserRepository.findByEmail as jest.MockedFunction<typeof mockUserRepository.findByEmail>).mockResolvedValue(mockUser);

        // Execute the use case and expect it to throw an error
        await expect(registerUserUseCase.register(mockRequest)).rejects.toThrow('User already exists');
    });
});