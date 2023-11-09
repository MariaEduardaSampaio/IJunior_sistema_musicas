import UserService from './UserService';
import prisma from '../../../../config/client';
import { User } from '@prisma/client';

// Mock the Prisma user schema
// const prisma = {
// 	user: {
// 		create: jest.fn(),
// 		delete: jest.fn(),
// 		findUnique: jest.fn(),
// 		findMany: jest.fn(),
// 		update: jest.fn(),
// 	},
// };  

// Mock the Prisma user schema
// jest.mock('../../../../config/client', () => ({
// 	user: {
// 		create: jest.fn(),
// 		delete: jest.fn(),
// 		findUnique: jest.fn(),
// 		findMany: jest.fn(),
// 		update: jest.fn(),
// 	},
// }));

describe('create', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('os dados do usuário são passados como entrada ==> cria esse usuario no banco', async () => {
		// ARRANGE
		const mockUser = {
			name: 'Lucas Paulo',
			email: 'lucaspaulo@example.com',
			password: 'password123',
			photo: 'photo.jpg',
			role: 'ADMIN',
		} as User;

		const mockEncryptedPassword = 'encryptedPassword';

		// .mockResolvedValue é usado quando a função mockada é async
		// A função encryptPassword vai retornar sempre 'encryptedPassword'
		const encryptedPasswordSpy = jest.spyOn(UserService, 'encryptPassword')
			.mockResolvedValue(mockEncryptedPassword);
			
		// Não temos esse usuario cadastrado no banco
		const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique')
			.mockResolvedValue(null);

		const createSpy = jest.spyOn(prisma.user, 'create')
			.mockResolvedValue({
				... mockUser, 
				password: mockEncryptedPassword
			});

		// ACT
		const createdUser = await UserService.create(mockUser);

		// ASSERT
		expect(findUniqueSpy).toHaveBeenCalledWith({
			where: {
				email: mockUser.email,
			},
		});
		expect(findUniqueSpy).toHaveBeenCalledTimes(1);

		// expect(encryptedPasswordSpy).toHaveBeenCalledWith(mockUser.password);  // A bug here
		expect(encryptedPasswordSpy).toHaveBeenCalledWith('password123');		
		expect(encryptedPasswordSpy).toHaveBeenCalledTimes(1);

		expect(createSpy).toHaveBeenCalledWith({
			data: {
				... mockUser
			},
		});
		expect(createSpy).toHaveBeenCalledTimes(1);

		expect(createdUser).toEqual({
			... mockUser,
			password: mockEncryptedPassword,
		});
	});

});

describe('deleteUser', () => {

});

describe('readUserByID', () => {

});

describe('readByEmail', () => {

});

describe('encryptPassword', () => {

});

describe('read', () => {

});

describe('updateUser', () => {

});