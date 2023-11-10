import UserService from './UserService';
import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import { QueryError } from '../../../../errors/QueryError';
import bcrypt from 'bcrypt';

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

	test('email do usuário a ser inserido já existe ==> lança uma exceção de Query', async () => {
		// ARRANGE
		const mockUser = {
			name: 'Lucas Paulo',
			email: 'lucaspaulo@example.com',
			password: 'password123',
			photo: 'photo.jpg',
			role: 'ADMIN',
		} as User;

		const mockEncryptedPassword = 'encryptedPassword';

		// A função encryptPassword vai retornar sempre 'encryptedPassword'
		jest.spyOn(UserService, 'encryptPassword')
			.mockResolvedValue(mockEncryptedPassword);
			
		// Temos esse usuario cadastrado no banco
		jest.spyOn(prisma.user, 'findUnique')
			.mockResolvedValue({
				...mockUser,
				id: 1,
			});

		// Não deve ser chamada
		jest.spyOn(prisma.user, 'create')
			.mockResolvedValue({
				... mockUser, 
				password: mockEncryptedPassword
			});

		// ACT & ASSERT

		// Esperamos que UserService.create lance uma exceção de QueryError
		return expect(async ()=>{
			await UserService.create(mockUser);
		}).rejects.toThrow(new QueryError('Email já cadastrado!'));
	});

	test('algum campo obrigatório não foi preenchido ==> lança uma exceção de Query', async () => {
		// ARRANGE
		const mockUser = {} as User;

		// ACT & ASSERT
		expect(async ()=> { await UserService.create(mockUser); })
			.rejects.toThrow(new QueryError('Campos obrigatórios não preenchidos.'));

		mockUser.id = 1;
		expect(async ()=> { await UserService.create(mockUser); })
			.rejects.toThrow(new QueryError('Campos obrigatórios não preenchidos.'));

		mockUser.email = 'lucas-example@gmail.com';
		expect(async ()=> { await UserService.create(mockUser); })
			.rejects.toThrow(new QueryError('Campos obrigatórios não preenchidos.'));

		mockUser.password = 'password123';
		expect(async ()=> { await UserService.create(mockUser); })
			.rejects.toThrow(new QueryError('Campos obrigatórios não preenchidos.'));

		mockUser.name = 'Lucas Paulo';
		expect(async ()=> { await UserService.create(mockUser); })
			.rejects.toThrow(new QueryError('Campos obrigatórios não preenchidos.'));
		
	});
});

describe('deleteUser', () => {

});

describe('readUserByID', () => {

});

describe('readByEmail', () => {

});

describe('encryptPassword', () => {

	test('a senha é passada como entrada ==> retorna ela criptografada', async () => {
		// ARRANGE
		const mockPassword = 'password123';
		const mockEncryptedPassword = 'encryptedPassword';
		const mockSalt = 10;
		const mockGenSalt = 'mockGenSalt'; 
		
		const saltSpy = jest.spyOn(bcrypt, 'genSalt')
			.mockImplementation(() => Promise.resolve(mockGenSalt));

		const bcryptSpy = jest.spyOn(bcrypt , 'hash')
			.mockImplementation(()=> Promise.resolve(mockEncryptedPassword));
		
		// ACT
		const encryptedPassword = await UserService.encryptPassword(mockPassword);

		// ASSERT
		expect(encryptedPassword).toEqual(mockEncryptedPassword);

		// FIX HERE
		// expect(saltSpy).toHaveBeenCalledTimes(1);
		// expect(saltSpy).toHaveBeenCalledWith(mockSalt);

		// expect(bcryptSpy).toHaveBeenCalledTimes(1);
		// expect(bcryptSpy).toHaveBeenCalledWith(mockPassword, mockGenSalt);

	});



});

describe('read', () => {

});

describe('updateUser', () => {

});